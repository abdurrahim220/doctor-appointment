import { nanoid } from "nanoid";
import prisma from "../../prisma/client";
import { IClinic, IClinicDoctor, IClinicNurse } from "./clinic.interface";
import initializeRedisClient from "../../config/redis.client";
import {
  allClinicDoctorZSet,
  allClinicNurseZSet,
  allClinicZSet,
  clinicDoctorKeyById,
  clinicKeyById,
  clinicNurseKeyById,
} from "../../utils/keys";
import AppError from "../../errors/appError";
import status from "http-status";

const CLINIC_BLOOM_KEY = "clinics_bloom";
const CLINIC_DOCTOR_BLOOM_KEY = "doctors_bloom";
const CLINIC_NURSE_BLOOM_KEY = "nurses_bloom";

const createClinic = async (payload: IClinic) => {
  const redisClient = await initializeRedisClient();
  const bloomKey = `${payload.name.toLocaleLowerCase()}|${payload.address.toLocaleLowerCase()}`;

  const exists = await redisClient.sendCommand(["BF.EXISTS", CLINIC_BLOOM_KEY, bloomKey]);
  if (exists) {
    throw new AppError("Clinic already exists redis", status.CONFLICT);
  }

  const clinic = await prisma.clinic.create({
    data: {
      id: nanoid(),
      name: payload.name,
      address: payload.address,
    },
    select: {
      id: true,
      name: true,
      address: true,
      doctors: true,
      nurses: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  await redisClient.set(clinicKeyById(clinic.id), JSON.stringify(clinic));
  await redisClient.zAdd(allClinicZSet(), {
    score: Date.now(),
    value: clinic.id,
  });
  await redisClient.sendCommand(["BF.ADD", CLINIC_BLOOM_KEY, bloomKey]);
  return clinic;
};

const assignDoctorToClinic = async (payload: IClinicDoctor) => {
  const redisClient = await initializeRedisClient();
  const { clinicId, doctorId } = payload;

  const bloomKey = `${clinicId}|${doctorId}`;

  const exists = await redisClient.sendCommand(["BF.EXISTS", CLINIC_DOCTOR_BLOOM_KEY, bloomKey]);
  if (exists) {
    throw new AppError("Doctor already assigned to this clinic (redis)", status.CONFLICT);
  }
  const clinic = await prisma.clinic.findUnique({
    where: { id: clinicId },
  });
  if (!clinic) {
    throw new AppError("Clinic not found", status.NOT_FOUND);
  }

  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: doctorId },
  });

  if (!doctor) {
    throw new AppError("Doctor not found", status.NOT_FOUND);
  }

  const clinicDoctorExists = await prisma.clinicDoctor.findUnique({
    where: {
      clinicId_doctorId: { clinicId, doctorId },
    },
  });
  if (clinicDoctorExists) {
    throw new AppError("Doctor already assigned to this clinic (db)", status.CONFLICT);
  }

  const result = await prisma.clinicDoctor.create({
    data: {
      id: nanoid(),
      clinicId,
      doctorId,
    },
  });

  await redisClient.set(clinicDoctorKeyById(result.id), JSON.stringify(result));
  await redisClient.zAdd(allClinicDoctorZSet(), {
    score: Date.now(),
    value: result.id,
  });
  await redisClient.sendCommand(["BF.ADD", CLINIC_DOCTOR_BLOOM_KEY, bloomKey]);

  return result;
};

const assignNurseToClinic = async (payload: IClinicNurse) => {
  const redisClient = await initializeRedisClient();
  const { clinicId, nurseId } = payload;

  const bloomKey = `${clinicId}|${nurseId}`;

  const exists = await redisClient.sendCommand(["BF.EXISTS", CLINIC_NURSE_BLOOM_KEY, bloomKey]);
  if (exists) {
    throw new AppError("Nurse already assigned to this clinic (redis)", status.CONFLICT);
  }
  const clinic = await prisma.clinic.findUnique({
    where: { id: clinicId },
  });
  if (!clinic) {
    throw new AppError("Clinic not found", status.NOT_FOUND);
  }

  const nurse = await prisma.nurseProfile.findUnique({
    where: { id: nurseId },
  });

  if (!nurse) {
    throw new AppError("Nurse not found", status.NOT_FOUND);
  }

  const clinicNurseExists = await prisma.clinicNurse.findUnique({
    where: {
      clinicId_nurseId: { clinicId, nurseId },
    },
  });
  if (clinicNurseExists) {
    throw new AppError("Nurse already assigned to this clinic (db)", status.CONFLICT);
  }

  const result = await prisma.clinicNurse.create({
    data: {
      id: nanoid(),
      clinicId,
      nurseId,
    },
  });
  await redisClient.set(clinicNurseKeyById(result.id), JSON.stringify(result));
  await redisClient.zAdd(allClinicNurseZSet(), {
    score: Date.now(),
    value: result.id,
  });
  await redisClient.sendCommand(["BF.ADD", CLINIC_NURSE_BLOOM_KEY, bloomKey]);
  return result;
};

const getClinic = async (clinicId: string) => {
  const redisClient = await initializeRedisClient();
  const clinic = await redisClient.get(clinicKeyById(clinicId));
  if (clinic) {
    return {
      data: JSON.parse(clinic),
      source: `redis` as const,
    };
  }
  const clinicFromDb = await prisma.clinic.findUnique({
    where: { id: clinicId },
    select: {
      id: true,
      name: true,
      address: true,
      doctors: true,
      nurses: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (clinicFromDb) {
    await redisClient.set(clinicKeyById(clinicId), JSON.stringify(clinicFromDb));
    return clinicFromDb;
  }
  throw new AppError("Clinic not found", status.NOT_FOUND);
};

const getClinicWithStaff = async () => {};

const getAllClinic = async (page: number, limit: number) => {
  const redisClient = await initializeRedisClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  const cachedClinics = await redisClient.zRange(allClinicZSet(), start, end, {
    REV: true,
  });
  if (cachedClinics.length >= limit || (start === 0 && cachedClinics.length > 0)) {
    const cachedData = await redisClient.mGet(cachedClinics.map((id) => clinicKeyById(id)));
    const clinics = cachedData.filter(Boolean).map((item) => JSON.parse(item as string));
    if (clinics.length) {
      return {
        data: clinics,
        source: `redis` as const,
        meta: {
          total: cachedData.length,
          page,
          limit,
          totalPage: Math.ceil(cachedData.length / limit),
        },
      };
    }
  }
  const result = await prisma.clinic.findMany({
    take: limit,
    skip: start,
    select: {
      id: true,
      name: true,
      address: true,
      doctors: true,
      nurses: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  for(const u of result){
    await redisClient.set(clinicKeyById(u.id),JSON.stringify(u))
    await redisClient.zAdd(allClinicZSet(),{
      score:new Date().getTime(),
      value:u.id
    })
  }
  return {
    data:result,
    source:`database` as const,
    meta:{
      page,
      limit,
      total:result.length,
      totalPage:Math.ceil(result.length/limit)
    }
  }
};

const getAllDoctors = async () => {};

const getAllNurses = async () => {};

export const clinicService = {
  createClinic,
  assignDoctorToClinic,
  assignNurseToClinic,
  getClinic,
  getClinicWithStaff,
  getAllClinic,
  getAllDoctors,
  getAllNurses,
};
