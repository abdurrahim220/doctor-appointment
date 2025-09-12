import { Router } from "express";
import { doctorProfileController } from "./doctor.controller";
import isAuth from "../../../middleware/isAuth";

const router = Router();

router.post("/create", isAuth(), doctorProfileController.createdDoctorProfile);
router.get("/get", isAuth(), doctorProfileController.getDoctorProfile);
router.put("/update", isAuth(), doctorProfileController.updateDoctorProfile);

export const doctorProfileRouter = router;
