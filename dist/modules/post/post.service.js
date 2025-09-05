"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const nanoid_1 = require("nanoid");
const createPost = async (payload) => {
    const { title, content, published, authorId } = payload;
    const id = (0, nanoid_1.nanoid)();
    const post = await client_1.default.post.create({
        data: {
            id,
            title,
            content,
            published: published ?? false,
            authorId: authorId ?? null,
        },
        include: {
            author: true,
        },
    });
    return post;
};
const getAllPost = async (page, limit) => {
    const skip = (page - 1) * limit;
    const [post, count] = await Promise.all([
        client_1.default.post.findMany({
            skip,
            take: limit,
            include: {
                author: true,
            },
        }),
        client_1.default.post.count(),
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
const getPostById = async (id) => {
    const post = await client_1.default.post.findUnique({
        where: { id },
        include: {
            author: true,
        },
    });
    return post;
};
const updatePost = async (id, payload) => {
    const post = await client_1.default.post.update({
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
const deletePost = async (id) => {
    const post = await client_1.default.post.delete({
        where: { id },
    });
    return post;
};
exports.postService = {
    createPost,
    getAllPost,
    getPostById,
    updatePost,
    deletePost,
};
