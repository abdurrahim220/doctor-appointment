"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const route_1 = __importDefault(require("./route"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const security_1 = __importDefault(require("./middleware/security"));
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, security_1.default)(app);
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("combined", {
        stream: {
            write: (message) => logger_1.default.http(message.trim()),
        },
    }));
}
app.use("/api/v1", route_1.default);
app.get("/", (_req, res) => {
    logger_1.default.info("Server is running 🚀");
    logger_1.default.info(`Uptime: ${process.uptime()}`);
    res.status(http_status_1.default.OK).json({
        message: "Server is running 🚀",
        uptime: process.uptime(),
    });
});
app.use(notFound_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
