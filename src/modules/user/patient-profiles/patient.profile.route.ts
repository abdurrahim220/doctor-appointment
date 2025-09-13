import { Router } from "express";
import validateRequest from "../../../middleware/validateRequest";
import { subUserValidation } from "./patient.profile.validation";
import { subUserController } from "./patient.profile.controller";
import isAuth from "../../../middleware/isAuth";

const router = Router()

router.post("/create-patient-profile",isAuth(),validateRequest(subUserValidation.createPatientProfileZodSchema),subUserController.createdPatientProfile)

router.put("/update-patient-profile",isAuth(),validateRequest(subUserValidation.updatePatientProfileZodSchema),subUserController.updatePatientProfile)

router.get("/get-patient-profile",isAuth(),subUserController.getPatientProfile)


export const patientProfileRoutes = router
