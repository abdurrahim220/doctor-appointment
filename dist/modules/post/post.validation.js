"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const postZodSchema = zod_1.default.object({
    id: zod_1.default.string().optional(),
    title: zod_1.default.string().min(3, "Title can not be empty"),
    content: zod_1.default.string().min(3, "Content can not be empty"),
    published: zod_1.default.boolean().default(false),
    authorId: zod_1.default.string(),
});
const postUpdateZodSchema = zod_1.default.object({
    id: zod_1.default.string().optional(),
    title: zod_1.default.string().min(3, "Title can not be empty").optional(),
    content: zod_1.default.string().min(3, "Content can not be empty").optional(),
    published: zod_1.default.boolean().default(false).optional(),
});
exports.postValidation = {
    postZodSchema,
    postUpdateZodSchema,
};
