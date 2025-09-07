import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router();

router.post("/login", validateRequest(authValidation.loginZodSchema), authController.login);
router.post("/logout", authController.logout);

export const authRouter = router;
