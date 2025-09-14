import { Router } from "express";
import { doctorProfileController } from "./doctor.controller";
import isAuth from "../../../middleware/isAuth";
import validateRequest from "../../../middleware/validateRequest";
import { doctorZodValidation } from "./doctor.validation";

const router = Router();

router.post(
  "/create",
  isAuth(),
  validateRequest(doctorZodValidation.createDoctorZodSchema),
  doctorProfileController.createdDoctorProfile,
);

router.get("/get", isAuth(), doctorProfileController.getDoctorProfile);

router.put(
  "/update",
  isAuth(),
  validateRequest(doctorZodValidation.updateDoctorZodSchema),
  doctorProfileController.updateDoctorProfile,
);  

router.get("/all", isAuth(), doctorProfileController.getAllDoctors);


export const doctorProfileRouter = router;
