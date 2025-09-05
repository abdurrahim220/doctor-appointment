"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
let redisClient = null;
const initializeRedisClient = async () => {
    if (!redisClient) {
        redisClient = (0, redis_1.createClient)();
        redisClient.on("error", (err) => {
            console.log("Redis error", err);
        });
        redisClient.on("connect", () => {
            console.log("Redis connected");
        });
        await redisClient.connect();
    }
    return redisClient;
};
exports.default = initializeRedisClient;
