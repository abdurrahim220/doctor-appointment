"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const createUser = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await user_service_1.userService.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User created successfully",
        data: result,
    });
});
const getAllUser = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await user_service_1.userService.getAllUser();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Users retrieved successfully from ${result.source}`,
        data: result,
    });
});
const getUserById = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await user_service_1.userService.getUserById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User retrieved successfully from ${result.source}`,
        data: result,
    });
});
const updateUser = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await user_service_1.userService.updateUser(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});
const deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await user_service_1.userService.deleteUser(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});
exports.userController = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
};
