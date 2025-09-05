"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userZodSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Name cannot be empty"),
    email: zod_1.z.email("Please provide a valid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
const updateUserZodSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Name cannot be empty"),
    email: zod_1.z.email("Please provide a valid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.userValidation = {
    userZodSchema,
    updateUserZodSchema,
};
