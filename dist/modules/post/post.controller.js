"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const post_service_1 = require("./post.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const createPost = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await post_service_1.postService.createPost(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Post created successfully",
        data: result,
    });
});
const getAllPost = (0, asyncHandler_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await post_service_1.postService.getAllPost(page, limit);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post fetched successfully",
        data: result,
    });
});
const getPostById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await post_service_1.postService.getPostById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Post retrieved successfully',
        data: result,
    });
});
const updatePost = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await post_service_1.postService.updatePost(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Post updated successfully',
        data: result,
    });
});
const deletePost = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await post_service_1.postService.deletePost((id));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Post deleted successfully',
        data: result,
    });
});
exports.postController = {
    createPost,
    getAllPost,
    getPostById,
    updatePost,
    deletePost,
};
