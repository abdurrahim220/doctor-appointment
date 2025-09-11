import status from "http-status";
import { BLOOM_KEY } from "../../config/bloom.redis";
import initializeRedisClient from "../../config/redis.client";
import AppError from "../../errors/appError";
import prisma from "../../prisma/client";
import { Role } from "../../types/schema.types";
import { allUsers, userKeyById } from "../../utils/keys";
import { IUser } from "./user.interface";
import * as bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const createUser = async (payload: IUser) => {
  const { password, name, email, gender, phone } = payload;
  const redisClient = await initializeRedisClient();
  const bfReply: unknown = await redisClient.sendCommand(["BF.EXISTS", BLOOM_KEY, email]);
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
      isActive: true,
      isDeleted: true,
      gender: true,
      phone: true,
      createdAt: true,
    },
  });
  await redisClient.sendCommand(["BF.ADD", BLOOM_KEY, user.email]);
  await redisClient.sendCommand(["BF.ADD", BLOOM_KEY, user.id]);

  await redisClient.zAdd(userKeyById(user.id), {
    score: new Date(user.createdAt).getTime(),
    value: JSON.stringify(user),
  });

  const cachedAllUsers = await redisClient.get(allUsers());
  if (cachedAllUsers) {
    const allUsersData = JSON.parse(cachedAllUsers);
    allUsersData.users.push(user);
    await redisClient.zAdd(
      allUsers(),
      {
        score: new Date(user.createdAt).getTime(),
        value: JSON.stringify(allUsersData),
      },
      {
        NX: true,
      },
    );
  }

  return user;
};

const getAllUser = async (page: number, limit: number) => {
  const redisClient = await initializeRedisClient();
  const start = (page - 1) * limit;
  const end = start + limit -1;
 const cachedUsers = await redisClient.zRange(allUsers(), start, end, {
    REV: true,
  });
  if (cachedUsers.length === limit) {
    return {
      data: cachedUsers.map((u)=>JSON.parse(u)),
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
    await redisClient.zAdd(allUsers(), {
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
      posts: {
        select: {
          title: true,
          content: true,
        },
      },
    },
  });

  await redisClient.set(userKeyById(id), JSON.stringify(user));
  return {
    data: user,
    source: `database` as const,
  };
};

const updateUser = async (id: string, payload: IUser) => {
  const { password, name, email } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return user;
};

const deleteUser = async (id: string) => {
  const redisClient = await initializeRedisClient();
  await redisClient.del(userKeyById(id));
  await prisma.user.delete({
    where: {
      id,
    },
  });
  await redisClient.del(userKeyById(id));
  await redisClient.del(allUsers());
};

const updateRole = async (id: string, payload: { role: Role }) => {
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
    },
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
