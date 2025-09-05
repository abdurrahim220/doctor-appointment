"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const redis_client_1 = __importDefault(require("../../config/redis.client"));
const client_1 = __importDefault(require("../../prisma/client"));
const keys_1 = require("../../utils/keys");
const bcrypt = __importStar(require("bcryptjs"));
const nanoid_1 = require("nanoid");
const createUser = async (payload) => {
    const { password, name, email } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);
    const redisClient = await (0, redis_client_1.default)();
    const id = (0, nanoid_1.nanoid)();
    const user = await client_1.default.user.create({
        data: {
            id,
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
    await redisClient.set((0, keys_1.userKeyById)(user.id), JSON.stringify(user));
    return user;
};
const getAllUser = async () => {
    const redisClient = await (0, redis_client_1.default)();
    const cachedData = await redisClient.get((0, keys_1.allUsers)());
    if (cachedData) {
        return {
            data: JSON.parse(cachedData),
            source: `redis`,
        };
    }
    const users = await client_1.default.user.findMany({
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
        source: `database`,
    };
    await redisClient.set((0, keys_1.allUsers)(), JSON.stringify(result), {
        EX: 60 * 60,
    });
    return result;
};
const getUserById = async (id) => {
    const redisClient = await (0, redis_client_1.default)();
    const cachedData = await redisClient.get((0, keys_1.userKeyById)(id));
    if (cachedData) {
        return {
            data: JSON.parse(cachedData),
            source: `redis`,
        };
    }
    const user = await client_1.default.user.findUnique({
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
    await redisClient.set((0, keys_1.userKeyById)(id), JSON.stringify(user));
    return {
        data: user,
        source: `database`,
    };
};
const updateUser = async (id, payload) => {
    const { password, name, email } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await client_1.default.user.update({
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
const deleteUser = async (id) => {
    const redisClient = await (0, redis_client_1.default)();
    await redisClient.del((0, keys_1.userKeyById)(id));
    await client_1.default.user.delete({
        where: {
            id,
        },
    });
    await redisClient.del((0, keys_1.userKeyById)(id));
    await redisClient.del((0, keys_1.allUsers)());
};
exports.userService = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
};
