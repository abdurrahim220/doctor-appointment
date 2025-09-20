import status from "http-status";
import initializeRedisClient from "../../config/redis.client";
import AppError from "../../errors/appError";
import { ISchedule } from "./schedule.interface";
import prisma from "../../prisma/client";
import { nanoid } from "nanoid";
import { allScheduleZSet, scheduleKeyById } from "../../utils/keys";
import combineDateAndTime from "../../helpers/combineDateAndTime";
import { dayMap } from "../../types/schema.types";

const BLOOM_FILTER_KEY = "schedules_bloom";

const createSchedule = async (payload: ISchedule) => {
  const redisClient = await initializeRedisClient();

  // Convert incoming strings to Date
  const startTime = combineDateAndTime(payload.date, payload.startTime);
  const endTime = combineDateAndTime(payload.date, payload.endTime);

  const bloomKey = `${payload.doctorId}:${payload.clinicId}:${startTime.toISOString()}`;

  const exists = await redisClient.sendCommand(["BF.EXISTS", BLOOM_FILTER_KEY, bloomKey]);
  if (exists) {
    throw new AppError(`Schedule already exists in bloom filter: ${bloomKey}`, status.CONFLICT);
  }
  const isoDate = new Date(payload.date).toISOString();

  const doctorInClinic = await prisma.clinicDoctor.findFirst({
    where: {
      doctorId: payload.doctorId,
      clinicId: payload.clinicId,
    },
  });

  if (!doctorInClinic) {
    throw new AppError("Doctor is not associated with this clinic", status.FORBIDDEN);
  }
  const timeConflict = await prisma.schedule.findFirst({
    where: {
      doctorId: payload.doctorId,
      clinicId: payload.clinicId,
      date: isoDate,
      OR: [
        {
          startTime: {
            lt: endTime,
          },
          endTime: {
            gt: startTime,
          },
        },
      ],
    },
  });

  if (timeConflict) {
    throw new AppError("Time conflict with existing schedule", status.CONFLICT);
  }

  if (endTime <= startTime) {
    throw new AppError("End time must be after start time", status.BAD_REQUEST);
  }

  const actualDay = dayMap[new Date(isoDate).getDay()];

  if (Array.isArray(payload.dayOfWeek) && !payload.dayOfWeek.includes(actualDay)) {
    throw new AppError("Day of week does not match the date", status.BAD_REQUEST);
  }

  const result = await prisma.schedule.create({
    data: {
      id: nanoid(),
      doctorId: payload.doctorId,
      clinicId: payload.clinicId,
      date: isoDate,
      startTime,
      endTime,
      maxPatients: payload.maxPatients,
      slotDuration: payload.slotDuration,
      dayOfWeek: payload.dayOfWeek,
    },
  });

  await redisClient.set(scheduleKeyById(result.id), JSON.stringify(result), {
    EX: 60 * 60,
  });

  await redisClient.zAdd(allScheduleZSet(), {
    score: Date.parse(startTime.toISOString()),
    value: scheduleKeyById(result.id),
  });

  await redisClient.sendCommand(["BF.ADD", BLOOM_FILTER_KEY, bloomKey]);

  return result;
};

const getSingleSchedule = async (scheduleId: string) => {
  const redisClient = await initializeRedisClient();
  const schedule = await redisClient.get(scheduleKeyById(scheduleId));
  if (schedule) {
    return {
      data: JSON.parse(schedule),
      source: `redis` as const,
    };
  }
  const result = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
    },
  });
  if (!result) {
    throw new AppError("Schedule not found", status.NOT_FOUND);
  }
  await redisClient.set(scheduleKeyById(result.id), JSON.stringify(result), {
    EX: 60 * 60,
  });
  await redisClient.zAdd(allScheduleZSet(), {
    score: Date.parse(result.startTime.toISOString()),
    value: scheduleKeyById(result.id),
  });
  return {
    data: result,
    source: `db` as const,
  };
};

const getAllSchedules = async (page: number, limit: number) => {
  const redisClient = await initializeRedisClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Get keys from sorted set
  const cachedScheduleKeys = await redisClient.zRange(allScheduleZSet(), start, end, {
    REV: true,
  });

  // Check if we have enough cached data that actually exists
  if (cachedScheduleKeys.length > 0) {
    const cachedData = await redisClient.mGet(cachedScheduleKeys);
    const validCachedData = cachedData.filter(Boolean);

    // Only return from Redis if we have enough valid data for the requested page
    if (validCachedData.length >= limit || (start === 0 && validCachedData.length > 0)) {
      const scheduleData = validCachedData.map((item) => JSON.parse(item as string));

      return {
        scheduleData,
        source: `redis` as const,
        meta: {
          total: cachedScheduleKeys.length, // This might not be accurate for total count
          page,
          limit,
          totalPage: Math.ceil(cachedScheduleKeys.length / limit),
        },
      };
    }
  }

  // Fall back to database
  const schedules = await prisma.schedule.findMany({
    orderBy: {
      startTime: "asc",
    },
    take: limit,
    skip: start,
  });

  // Store data in Redis and update sorted set
  for (const schedule of schedules) {
    const key = scheduleKeyById(schedule.id);

    // Store the actual schedule data
    await redisClient.set(key, JSON.stringify(schedule), {
      EX: 60 * 60,
    });

    // Add to sorted set if not already there
    await redisClient.zAdd(allScheduleZSet(), {
      score: Date.parse(schedule.startTime.toISOString()),
      value: key,
    });
  }

  return {
    scheduleData: schedules,
    source: `db` as const,
    meta: {
      total: schedules.length,
      page,
      limit,
      totalPage: Math.ceil(schedules.length / limit),
    },
  };
};

const updateSchedule = async (scheduleId: string, payload: Partial<ISchedule>) => {
  const redisClient = await initializeRedisClient();
  const result = await getSingleSchedule(scheduleId);
  const existingSchedule = result.data;
  let dateString: string;
  if (existingSchedule.date instanceof Date) {
    dateString = existingSchedule.date.toISOString().split("T")[0];
  } else if (typeof existingSchedule.date === "string") {
    dateString = existingSchedule.date.split("T")[0];
  } else {
    throw new AppError("Invalid date format", status.BAD_REQUEST);
  }

  const startTime = payload.startTime
    ? combineDateAndTime(dateString, payload.startTime, "+00:00")
    : existingSchedule.startTime;

  const endTime = payload.endTime
    ? combineDateAndTime(dateString, payload.endTime, "+00:00")
    : existingSchedule.endTime;

  if (endTime <= startTime) {
    throw new AppError("End time must be after start time", status.BAD_REQUEST);
  }
  if (payload.dayOfWeek) {
    const actualDay = new Date(existingSchedule.date).getDay();
    if (!payload.dayOfWeek.includes(dayMap[actualDay])) {
      throw new AppError("Day of week does not match the date", status.BAD_REQUEST);
    }
  }
  const timeConflict = await prisma.schedule.findFirst({
    where: {
      doctorId: existingSchedule.doctorId,
      clinicId: existingSchedule.clinicId,
      date: existingSchedule.date,
      id: { not: scheduleId },
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      ],
    },
  });

  if (timeConflict) {
    throw new AppError("Time conflict with another schedule", status.CONFLICT);
  }

  const updatedSchedule = await prisma.schedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      ...payload,
      startTime,
      endTime,
    },
  });
  await redisClient.set(scheduleKeyById(updatedSchedule.id), JSON.stringify(updatedSchedule), {
    EX: 60 * 60,
  });
  await redisClient.zAdd(allScheduleZSet(), {
    score: Date.parse(updatedSchedule.startTime.toISOString()),
    value: scheduleKeyById(updatedSchedule.id),
  });
  const bloomKey = `${updatedSchedule.doctorId}:${updatedSchedule.clinicId}:${updatedSchedule.startTime.toISOString()}`;
  await redisClient.sendCommand(["BF.ADD", BLOOM_FILTER_KEY, bloomKey]);
  return updatedSchedule;
};
const deleteSchedule = async (scheduleId: string) => {
  const redisClient = await initializeRedisClient();
  const result = await getSingleSchedule(scheduleId);
  const existingSchedule = result.data;
  await prisma.schedule.delete({
    where: {
      id: scheduleId,
    },
  });
  await redisClient.del(scheduleKeyById(scheduleId));
  const bloomKey = `${existingSchedule.doctorId}:${existingSchedule.clinicId}:${existingSchedule.startTime.toISOString()}`;
  await redisClient.sendCommand(["BF.REMOVE", BLOOM_FILTER_KEY, bloomKey]);
  return existingSchedule;
};

export const scheduleService = {
  createSchedule,
  getSingleSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedules,
};
