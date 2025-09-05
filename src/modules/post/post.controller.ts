import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createPost = asyncHandler(async (req: Request, res: Response) => {
  const result = await postService.createPost(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});

const getAllPost = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await postService.getAllPost(page, limit);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Post fetched successfully",
    data: result,
  });
});



const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await postService.getPostById(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Post retrieved successfully',
    data: result,
  });
});

const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await postService.updatePost(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await postService.deletePost((id));

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  });
});

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePost,
};
