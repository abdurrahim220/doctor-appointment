import status from "http-status";
import AppError from "../../../errors/appError";
import prisma from "../../../prisma/client";
import { IPatientProfile } from "../user.interface";
import { nanoid } from "nanoid";
import initializeRedisClient from "../../../config/redis.client";
import { allPatientProfiles, patientProfileKeyById } from "../../../utils/keys";

const createPatientProfile = async (data: IPatientProfile, userId: string) => {
  const redisClient = await initializeRedisClient();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  const existingProfile = await prisma.patientProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (existingProfile) {
    throw new AppError("Patient profile already exists for this user", status.BAD_REQUEST);
  }

  const result = await prisma.patientProfile.create({
    data: {
      id: nanoid(),
      userId: userId,
      dateOfBirth: data.dateOfBirth,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          role: true,
          gender: true,
        },
      },
    },
  });

  await redisClient.set(patientProfileKeyById(userId), JSON.stringify(result), {
    EX: 60 * 60,
  });
  const cachedAllProfiles = await redisClient.get(allPatientProfiles());
  if (cachedAllProfiles) {
    const allProfilesData = JSON.parse(cachedAllProfiles);
    allProfilesData.profiles.push(result);
    await redisClient.set(allPatientProfiles(), JSON.stringify(allProfilesData), {
      EX: 60 * 60,
    });
  }
  return result;
};

const getPatientProfile = async (userId: string) => {
  const redisClient = await initializeRedisClient();
  const cachedData = await redisClient.get(patientProfileKeyById(userId));
  if (cachedData) {
    return {
      data: JSON.parse(cachedData),
      source: `redis` as const,
    };
  }
  const patientProfile = await prisma.patientProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          role: true,
          gender: true,
        },
      },
    },
  });

  await redisClient.set(patientProfileKeyById(userId), JSON.stringify(patientProfile), {
    EX: 60 * 60,
  });

  return {
    data: patientProfile,
    source: `database` as const,
  };
};

const updatePatientProfile = async (userId: string, data: IPatientProfile) => {
  const result = await prisma.patientProfile.update({
    where: {
      userId,
    },
    data,
  });
  return result;
};

export const patientProfileService = {
  createPatientProfile,
  getPatientProfile,
  updatePatientProfile,
};
