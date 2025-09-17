import status from "http-status";
import initializeRedisClient from "../../config/redis.client";
import AppError from "../../errors/appError";
import { ISchedule } from "./schedule.interface";
import prisma from "../../prisma/client";
import { nanoid } from "nanoid";
import { allScheduleZSet, scheduleKeyById } from "../../utils/keys";

const BLOOM_FILTER_KEY = "schedules_bloom";

const createSchedule = async (payload: ISchedule) => {
  const redisClient = await initializeRedisClient();

  // Convert incoming strings to Date
  const startTime = new Date(payload.startTime);
  const endTime = new Date(payload.endTime);

  const bloomKey = `${payload.doctorId}:${payload.clinicId}:${startTime.toISOString()}`;

  const exists = await redisClient.sendCommand(["BF.EXISTS", BLOOM_FILTER_KEY, bloomKey]);
  if (exists) {
    throw new AppError(`Schedule already exists in bloom filter: ${bloomKey}`, status.CONFLICT);
  }

  const doctorInClinic = await prisma.clinicDoctor.findFirst({
    where: {
      doctorId: payload.doctorId,
      clinicId: payload.clinicId,
    },
  });

  if (!doctorInClinic) {
    throw new AppError("Doctor is not associated with this clinic", status.FORBIDDEN);
  }

  const result = await prisma.schedule.create({
    data: {
      id: nanoid(),
      doctorId: payload.doctorId,
      clinicId: payload.clinicId,
      startTime,
      endTime,
      isAvailable: payload.isAvailable ?? true,
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

const getSchedule = async () => {};

const updateSchedule = async () => {};

const deleteSchedule = async () => {};

export const scheduleService = {
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
};
