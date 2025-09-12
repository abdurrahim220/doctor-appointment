import { Router } from "express";
import validateRequest from "../../../middleware/validateRequest";
import { subUserValidation } from "./user.profile.validation";
import { subUserController } from "./user.profile.controller";
import isAuth from "../../../middleware/isAuth";

const router = Router()

router.post("/create-patient-profile",isAuth(),validateRequest(subUserValidation.createPatientProfileZodSchema),subUserController.createdPatientProfile)

router.put("/update-patient-profile",isAuth(),validateRequest(subUserValidation.updatePatientProfileZodSchema),subUserController.updatePatientProfile)

router.get("/get-patient-profile",isAuth(),subUserController.getPatientProfile)


export const subUserRoutes = router