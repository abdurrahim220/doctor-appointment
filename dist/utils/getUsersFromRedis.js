"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersFromRedis = void 0;
const redis_client_1 = __importDefault(require("../config/redis.client"));
const getUsersFromRedis = async (page, limit) => {
    const redisClient = await (0, redis_client_1.default)();
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const usersRaw = await redisClient.zRevRange("users", start, end);
    // Safely convert to string array
    const usersArray = Array.isArray(usersRaw) ? usersRaw : [];
    const parsedUsers = usersArray.map((u) => JSON.parse(u));
    return parsedUsers;
};
exports.getUsersFromRedis = getUsersFromRedis;
