import status from "http-status";
import initializeRedisClient from "../../../config/redis.client";
import AppError from "../../../errors/appError";
import prisma from "../../../prisma/client";
import { IDoctorProfile } from "../user.interface";
import { nanoid } from "nanoid";
import { allDoctorProfilesZSet, doctorProfileKeyById } from "../../../utils/keys";

const createDoctorProfile = async (data: IDoctorProfile, userId: string) => {
  const redisClient = await initializeRedisClient();
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (doctorProfile) {
    throw new AppError("Doctor profile already exists in redis", status.BAD_REQUEST);
  }

  const result = await prisma.doctorProfile.create({
    data: {
      id: nanoid(),
      userId: userId,
      specialty: data.specialty,
      licenseNumber: data.licenseNumber,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
        },
      },
      schedules: true,
      appointments: true,
      clinics: true,
    },
  });

  await redisClient.set(doctorProfileKeyById(userId), JSON.stringify(result), {
    EX: 60 * 60,
  });
  await redisClient.zAdd(allDoctorProfilesZSet(), {
    score: Date.now(),
    value: userId,
  });
  return result;
};

const getDoctorProfile = async (userId: string) => {
  const redisClient = await initializeRedisClient();
  const cachedProfile = await redisClient.get(doctorProfileKeyById(userId));
  if (cachedProfile) {
    return {
      data: JSON.parse(cachedProfile),
      source: `redis` as const,
    };
  }
  const result = await prisma.doctorProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
        },
      },
      schedules: true,
      appointments: true,
      clinics: true,
    },
  });
  if (result) {
    await redisClient.set(doctorProfileKeyById(userId), JSON.stringify(result), {
      EX: 60 * 60,
    });
  }
  return {
    data: result,
    source: `db` as const,
  };
};

const updateDoctorProfile = async (userId: string, data: Partial<IDoctorProfile>) => {
  const redisClient = await initializeRedisClient();

  const result = await prisma.doctorProfile.update({
    where: {
      userId,
    },
    data,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
        },
      },
      schedules: true,
      appointments: true,
      clinics: true,
    },
  });

  await redisClient.set(doctorProfileKeyById(userId), JSON.stringify(result), {
    EX: 60 * 60,
  });

  await redisClient.zAdd(allDoctorProfilesZSet(), {
    score: new Date().getTime(),
    value: userId,
  });

  return result;
};

const getAllDoctors = async (page: number, limit: number) => {
  const redisClient = await initializeRedisClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  const cachedDoctors = await redisClient.zRange(allDoctorProfilesZSet(), start, end, {
    REV: true,
  });
  if (cachedDoctors.length >= limit || (start === 0 && cachedDoctors.length > 0)) {
    const cached = await redisClient.mGet(cachedDoctors.map((userId) => doctorProfileKeyById(userId)));
    const doctors = cached.filter(Boolean).map((item) => JSON.parse(item as string));
    if (doctors.length) {
      return {
        data: doctors,
        source: `redis` as const,
        meta: {
          total: cachedDoctors.length,
          page,
          limit,
          totalPages: Math.ceil(cachedDoctors.length / limit),
        },
      };
    }
  }
  const result = await prisma.doctorProfile.findMany({
    take: limit,
    skip: start,

    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
        },
      },
      schedules: true,
      appointments: true,
      clinics: true,
    },
  });

  for (const u of result) {
    await redisClient.set(doctorProfileKeyById(u.userId), JSON.stringify(u));
    await redisClient.zAdd(allDoctorProfilesZSet(), {
      score: new Date().getTime(),
      value: u.userId,
    });
  }
  return {
    data: result,
    source: `db` as const,
  };
};

export const doctorProfileService = {
  createDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
};
