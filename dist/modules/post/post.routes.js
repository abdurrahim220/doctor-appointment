"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = require("express");
const post_controller_1 = require("./post.controller");
const post_validation_1 = require("./post.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = (0, express_1.Router)();
router.post("/", (0, validateRequest_1.default)(post_validation_1.postValidation.postZodSchema), post_controller_1.postController.createPost);
router.get("/", post_controller_1.postController.getAllPost);
router.get("/:id", post_controller_1.postController.getPostById);
router.put("/:id", (0, validateRequest_1.default)(post_validation_1.postValidation.postUpdateZodSchema), post_controller_1.postController.updatePost);
router.delete("/:id", post_controller_1.postController.deletePost);
exports.postRoutes = router;
