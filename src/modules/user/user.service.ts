import initializeRedisClient from "../../config/redis.client";
import prisma from "../../prisma/client";
import { Role } from "../../types/schema.types";
import { allUsers, userKeyById } from "../../utils/keys";
import { IUser } from "./user.interface";
import * as bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const createUser = async (payload: IUser) => {
  const { password, name, email, gender, phone } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const redisClient = await initializeRedisClient();
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
    },
  });
  await redisClient.set(userKeyById(user.id), JSON.stringify(user));

  const cachedAllUsers = await redisClient.get(allUsers());
  if (cachedAllUsers) {
    const allUsersData = JSON.parse(cachedAllUsers);
    allUsersData.users.push(user);
    await redisClient.set(allUsers(), JSON.stringify(allUsersData), {
      EX: 60 * 60,
    });
  }

  return user;
};

const getAllUser = async () => {
  const redisClient = await initializeRedisClient();
  const cachedData = await redisClient.get(allUsers());
  if (cachedData) {
    return {
      data: JSON.parse(cachedData),
      source: `redis` as const,
    };
  }
  const users = await prisma.user.findMany({
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

  const result = {
    users,
    source: `database` as const,
  };
  await redisClient.set(allUsers(), JSON.stringify(result), {
    EX: 60 * 60,
  });
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
