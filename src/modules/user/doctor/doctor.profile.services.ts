import status from "http-status";
import initializeRedisClient from "../../../config/redis.client";
import AppError from "../../../errors/appError";
import prisma from "../../../prisma/client";
import { IDoctorProfile } from "../user.interface";
import { nanoid } from "nanoid";

const createDoctorProfile = async (data: IDoctorProfile, userId: string) => {
  const redisClient = await initializeRedisClient();
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (doctorProfile) {
    throw new AppError("Doctor profile already exists", status.BAD_REQUEST);
  }

  const result = await prisma.doctorProfile.create({
    data: {
      id: nanoid(),
      userId: userId,
      specialty: data.specialty,
      licenseNumber: data.licenseNumber,
    },
  });
  return result;
};

const getDoctorProfile = async (userId: string) => {
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
  return result;
};

const updateDoctorProfile = async (userId: string, data: Partial<IDoctorProfile>) => {
  const result = await prisma.doctorProfile.update({
    where: {
      userId,
    },
    data,
  });
  return result;
};

export const doctorProfileService = {
  createDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
};
