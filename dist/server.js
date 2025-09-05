"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const redis_client_1 = __importDefault(require("./config/redis.client"));
const client_1 = require("./prisma/client");
async function startServer() {
    await (0, client_1.connectToDatabase)();
    await (0, redis_client_1.default)();
    app_1.default.listen(config_1.config.port, () => {
        console.log(`Server is running on port ${config_1.config.port}`);
    });
}
startServer();
