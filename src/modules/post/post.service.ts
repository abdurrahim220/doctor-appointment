import prisma from "../../prisma/client";
import { IPost, IPostUpdate } from "./post.interface";
import { nanoid } from "nanoid";
const createPost = async (payload: IPost) => {
  const { title, content, published, authorId } = payload;
  const id = nanoid();
  const post = await prisma.post.create({
    data: {
      id,
      title,
      content,
      published: published ?? false,
      authorId:authorId ?? null,
    },
    include: {
      author: true,
    },
  });
  return post;
};

const getAllPost = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [post, count] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: true,
      },
    }),
    prisma.post.count(),
  ]);
  return {
    post,
    meta: {
      total: count,
      page,
      limit,
    },
  };
};

const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });
  return post;
};

const updatePost = async (id: string, payload: IPostUpdate) => {
  const post = await prisma.post.update({
    where: { id },
    data: payload,
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return post;
};

const deletePost = async (id: string) => {
  const post = await prisma.post.delete({
    where: { id },
  });
  return post;
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePost,
};
