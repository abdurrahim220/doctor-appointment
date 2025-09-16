import { Router } from "express";
import { clinicController } from "./clinic.controller";
import isAuth from "../../middleware/isAuth";
import { Role } from "../../types/schema.types";
import validateRequest from "../../middleware/validateRequest";
import { clinicZodValidation } from "./clinic.validation";

const router = Router();

router.post("/create", isAuth([Role.ADMIN, Role.SUPER_ADMIN]), validateRequest(clinicZodValidation.createClinicZodSchema),clinicController.createClinic);

router.post("/assign-doctor", isAuth([Role.ADMIN, Role.SUPER_ADMIN]), validateRequest(clinicZodValidation.assignDoctorToClinicZodSchema),clinicController.assignDoctorToClinic);


router.post("/assign-nurse", clinicController.assignNurseToClinic);
router.get("/:id", clinicController.getClinic);
router.get("/:id/staff", clinicController.getClinicWithStaff);
router.get("/all", clinicController.getAllClinic);
router.get("/doctors", clinicController.getAllDoctors);
router.get("/nurses", clinicController.getAllNurses);

export const clinicRoutes = router;
