import prisma from "../../../prisma/client";
import { INurseProfile } from "../user.interface";

const createNurseProfile = async (data: INurseProfile, userId: string) => {
  const result = await prisma.nurseProfile.create({
    data,
  });
  return result;
};

const getNurseProfile = async (userId: string) => {
  const result = await prisma.nurseProfile.findUnique({
    where: {
      userId,
    },
  });
  return result;
};

const updateNurseProfile = async (userId: string, data: INurseProfile) => {
  const result = await prisma.nurseProfile.update({
    where: {
      userId,
    },
    data,
  });
  return result;
};

export const nurseProfileService = {
  createNurseProfile,
  getNurseProfile,
  updateNurseProfile,
};
