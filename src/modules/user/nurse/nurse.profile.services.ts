import status from "http-status";
import AppError from "../../../errors/appError";
import prisma from "../../../prisma/client";
import { INurseProfile } from "../user.interface";
import { nanoid } from "nanoid";
import initializeRedisClient from "../../../config/redis.client";
import { allNurseProfilesZSet, nurseProfileKeyById } from "../../../utils/keys";

const createNurseProfile = async (data: INurseProfile, userId: string) => {
  const redisClient = await initializeRedisClient();
  const nurseProfile = await prisma.nurseProfile.findUnique({
    where: {
      userId,
    },
  });
  if (nurseProfile) {
    throw new AppError("Nurse profile already exists in redis", status.BAD_REQUEST);
  }
  const result = await prisma.nurseProfile.create({
    data: {
      id: nanoid(),
      userId: userId,
      licenseNumber: data.licenseNumber,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      clinics: true,
    },
  });

  await redisClient.set(nurseProfileKeyById(userId), JSON.stringify(result), {
    EX: 60 * 60,
  });
  await redisClient.zAdd(allNurseProfilesZSet(), {
    score: Date.now(),
    value: userId,
  });

  return result;
};

const getNurseProfile = async (userId: string) => {
  const redisClient = await initializeRedisClient();
  const cachedProfile = await redisClient.get(nurseProfileKeyById(userId));
  if (cachedProfile) {
    return {
      data: JSON.parse(cachedProfile),
      source: `redis` as const,
    };
  }
  const result = await prisma.nurseProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      clinics: true,
    },
  });
  if (result) {
    await redisClient.set(nurseProfileKeyById(userId), JSON.stringify(result), {
      EX: 60 * 60,
    });
  }
  return result;
};

const updateNurseProfile = async (userId: string, data: Partial<INurseProfile>) => {
  const redisClient = await initializeRedisClient();
  const result = await prisma.nurseProfile.update({
    where: {
      userId,
    },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      clinics: true,
    },
  });
  if (result) {
    await redisClient.set(nurseProfileKeyById(userId), JSON.stringify(result), {
      EX: 60 * 60,
    });
  }
  await redisClient.zAdd(allNurseProfilesZSet(), {
    score: Date.now(),
    value: userId,
  });
  return result;
};

const getAllNurseProfiles = async (page: number, limit: number) => {
  const redisClient = await initializeRedisClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Try to get paginated results from Redis sorted set
  const cachedProfileIds = await redisClient.zRange(allNurseProfilesZSet(), start, end, {
    REV: true, // Get newest first
  });

  if (cachedProfileIds.length > 0) {
    // Get full profile data for each cached ID
    const pipeline = redisClient.multi();
    cachedProfileIds.forEach((userId) => {
      pipeline.get(nurseProfileKeyById(userId));
    });

    const cachedProfilesResult = await pipeline.exec();

    // Extract string values from Redis replies
    const validProfiles: string[] = [];
    cachedProfilesResult.forEach((result) => {
      if (result !== null && typeof result === "string") {
        validProfiles.push(result);
      }
    });

    if (validProfiles.length === cachedProfileIds.length) {
      const parsedProfiles = validProfiles.map((profile) => JSON.parse(profile));

      // Get total count from Redis
      const total = await redisClient.zCard(allNurseProfilesZSet());

      return {
        data: parsedProfiles,
        source: "redis" as const,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  }

  // Fallback to database if Redis cache is incomplete
  const [profiles, totalCount] = await Promise.all([
    prisma.nurseProfile.findMany({
      skip: start,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        clinics: true,
      },
    }),
    prisma.nurseProfile.count(),
  ]);

  // Cache the results in Redis
  const pipeline = redisClient.multi();
  profiles.forEach((profile) => {
    pipeline.set(nurseProfileKeyById(profile.userId), JSON.stringify(profile), {
      EX: 60 * 60,
    });
    pipeline.zAdd(allNurseProfilesZSet(), {
      score: Date.now(),
      value: profile.userId,
    });
  });
  await pipeline.exec();

  return {
    data: profiles,
    source: "database" as const,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const nurseProfileService = {
  createNurseProfile,
  getNurseProfile,
  updateNurseProfile,
  getAllNurseProfiles,
};
