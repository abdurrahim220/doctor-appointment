// src/modules/user/user.routes.ts
import { Router } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../middleware/validateRequest";
import isAuth from "../../middleware/isAuth";
import { Role } from "../../types/schema.types";

const router = Router();

router.post("/", validateRequest(userValidation.userZodSchema), userController.createUser);
router.get("/", isAuth(["USER", "ADMIN"]), userController.getAllUser);

router.get("/:id", userController.getUserById);
router.put("/:id", validateRequest(userValidation.updateUserZodSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

// router.get("/profile", userController.getUserProfile);
// router.patch("/update-role", userController.updateUserRole);
export const userRoutes = router;
