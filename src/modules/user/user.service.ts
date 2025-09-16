import status from "http-status";
import {  } from "../../config/bloom.redis";
import initializeRedisClient from "../../config/redis.client";
import AppError from "../../errors/appError";
import prisma from "../../prisma/client";
import { Role } from "../../types/schema.types";
import { userKeyById, allUsersZSet } from "../../utils/keys";
import { IUser } from "./user.interface";
import * as bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
const USER_BLOOM_KEY = "users_bloom";

const createUser = async (payload: IUser) => {
  const { password, name, email, gender, phone } = payload;
  const redisClient = await initializeRedisClient();
  const bfReply: unknown = await redisClient.sendCommand(["BF.EXISTS", USER_BLOOM_KEY, email.toLocaleLowerCase()]);
  if (bfReply === 1) {
    const existing = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existing) {
      throw new AppError("User already exists", status.BAD_REQUEST);
    }
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = nanoid();

  const user = await prisma.user.create({
    data: {
      id,
      name,
      email,
      gender,
      phone,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      gender: true,
      phone: true,
      createdAt: true,
    },
  });
  await redisClient.sendCommand(["BF.ADD", USER_BLOOM_KEY, user.email]);
  await redisClient.sendCommand(["BF.ADD", USER_BLOOM_KEY, user.id]);

  await redisClient.set(userKeyById(user.id), JSON.stringify(user));

  return user;
};

const getAllUser = async (page: number, limit: number) => {
  const redisClient = await initializeRedisClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  const cachedUsers = await redisClient.zRange(allUsersZSet(), start, end, {
    REV: true,
  });
  if (cachedUsers.length >= limit || (start === 0 && cachedUsers.length > 0)) {
    return {
      data: cachedUsers.map((u) => JSON.parse(u)),
      source: `redis` as const,
    };
  }
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: start,
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
      posts: {
        select: {
          title: true,
          content: true,
        },
      },
    },
  });

  for (const u of users) {
    await redisClient.zAdd(allUsersZSet(), {
      score: new Date(u.createdAt).getTime(),
      value: JSON.stringify(u),
    });
  }

  const result = {
    users,
    source: `database` as const,
  };
  return result;
};

const getUserById = async (id: string) => {
  const redisClient = await initializeRedisClient();
  const cachedData = await redisClient.get(userKeyById(id));
  if (cachedData) {
    return {
      data: JSON.parse(cachedData),
      source: `redis` as const,
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      role: true,
      gender: true,
      phone: true,
      createdAt: true,
      posts: {
        select: {
          title: true,
          content: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }
  await redisClient.set(userKeyById(id), JSON.stringify(user));
  await redisClient.zAdd(allUsersZSet(), {
    score: new Date(user.createdAt).getTime(),
    value: JSON.stringify(user),
  });
  return {
    data: user,
    source: `database` as const,
  };
};

const updateUser = async (id: string, payload: IUser) => {
  const redisClient = await initializeRedisClient();
  const { password, name, email, gender, phone } = payload;
  if (email) {
    const bfReply: unknown = await redisClient.sendCommand(["BF.EXISTS", USER_BLOOM_KEY, email.toLocaleLowerCase()]);
    if (bfReply === 1) {
      const existing = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existing && existing.id !== id) {
        throw new AppError("Email already exists", status.BAD_REQUEST);
      }
    }
  }

  let hashedPassword: string | undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password: hashedPassword,
      gender,
      phone,
    },
    select: {
      name: true,
      email: true,
      gender: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
  if (email) {
    await redisClient.sendCommand(["BF.ADD", USER_BLOOM_KEY, email]);
  }
  await redisClient.set(userKeyById(id), JSON.stringify(user));
  await redisClient.zAdd(allUsersZSet(), {
    score: new Date(user.createdAt).getTime(),
    value: JSON.stringify(user),
  });
  return user;
};

const deleteUser = async (id: string) => {
  const redisClient = await initializeRedisClient();
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }
  await prisma.user.delete({
    where: {
      id,
    },
  });
  await redisClient.del(userKeyById(id));

  const cachedAllUsers = await redisClient.zRange(allUsersZSet(), 0, -1);
  for (const u of cachedAllUsers) {
    const parsed = JSON.parse(u);
    if (parsed.id === id) {
      await redisClient.zRem(allUsersZSet(), u);
      break;
    }
  }
};

const updateRole = async (id: string, payload: { role: Role }) => {
  const redisClient = await initializeRedisClient();
  const { role } = payload;
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  await redisClient.set(userKeyById(id), JSON.stringify(user));

  const cachedAllUsers = await redisClient.zRange(allUsersZSet(), 0, -1);
  for (const u of cachedAllUsers) {
    const parsed = JSON.parse(u);
    if (parsed.id === id) {
      await redisClient.zRem(allUsersZSet(), u);
      break;
    }
  }
  await redisClient.zAdd(allUsersZSet(), {
    score: new Date(user.createdAt).getTime(),
    value: JSON.stringify(user),
  });
  return user;
};

const getUserProfile = async (id: string) => {
  const redisClient = await initializeRedisClient();
  const cachedData = await redisClient.get(userKeyById(id));
  if (cachedData) {
    return {
      data: JSON.parse(cachedData),
      source: `redis` as const,
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      role: true,
      isActive: true,
      isDeleted: true,
      gender: true,
      phone: true,
    },
  });
  await redisClient.set(userKeyById(id), JSON.stringify(user), {
    EX: 60 * 60,
  });
  return {
    data: user,
    source: `database` as const,
  };
};

export const userService = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  updateRole,
  getUserProfile,
};
