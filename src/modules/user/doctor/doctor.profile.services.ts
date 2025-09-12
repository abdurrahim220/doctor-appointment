import prisma from "../../../prisma/client";
import { IDoctorProfile } from "../user.interface";


const createDoctorProfile = async (data: IDoctorProfile, userId: string) => {
  const result = await prisma.doctorProfile.create({
    data,
  });
  return result;
};


const getDoctorProfile = async (userId: string) => {
  const result = await prisma.doctorProfile.findUnique({
    where: {
      userId,
    },
  });
  return result;
};

const updateDoctorProfile = async (userId: string, data: any) => {
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
