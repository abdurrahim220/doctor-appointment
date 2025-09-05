"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
// src/modules/user/user.routes.ts
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = (0, express_1.Router)();
router.post("/", (0, validateRequest_1.default)(user_validation_1.userValidation.userZodSchema), user_controller_1.userController.createUser);
router.get("/", user_controller_1.userController.getAllUser);
router.get("/:id", user_controller_1.userController.getUserById);
router.put("/:id", (0, validateRequest_1.default)(user_validation_1.userValidation.updateUserZodSchema), user_controller_1.userController.updateUser);
router.delete("/:id", user_controller_1.userController.deleteUser);
exports.userRoutes = router;
