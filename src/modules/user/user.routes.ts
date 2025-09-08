// src/modules/user/user.routes.ts
import { Router } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../middleware/validateRequest";
import isAuth from "../../middleware/isAuth";
import { Role } from "../../types/schema.types";

const router = Router();

router.post("/", validateRequest(userValidation.userZodSchema), userController.createUser);
router.get("/profile", isAuth(), userController.getUserProfile);

router.get("/", isAuth([Role.USER, Role.ADMIN]), userController.getAllUser);

router.get("/:id", userController.getUserById);
router.put("/:id", validateRequest(userValidation.updateUserZodSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.patch(
  "/update-role/:id",
  isAuth([Role.ADMIN]),
  validateRequest(userValidation.updateRoleZodSchema),
  userController.updateRole,
);
export const userRoutes = router;
