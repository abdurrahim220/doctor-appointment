import prisma from "../../prisma/client";
import { IUser } from "./user.interface";
import * as bcrypt from "bcryptjs";

const createUser = async (payload: IUser) => {
  const { password, name, email } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return user;
};

const getAllUser = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [users, count] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        posts: true,
      },
    }),
    prisma.user.count(),
  ]);
  return {
    users,
    meta: {
      total: count,
      page: 1,
      limit: 10,
    },
  };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return user;
};

const updateUser = async (id: string, payload: IUser) => {
  const { password, name, email } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return user;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });
  return user;
};

export const userService = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
