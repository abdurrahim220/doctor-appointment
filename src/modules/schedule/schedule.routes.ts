import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import isAuth from "../../middleware/isAuth";
import { Role } from "../../types/schema.types";
import validateRequest from "../../middleware/validateRequest";
import { scheduleZodValidation } from "./schedule.validation";

const router = Router();

router.post("/create", isAuth([Role.DOCTOR,Role.ADMIN]), validateRequest(scheduleZodValidation.scheduleZodSchema),scheduleController.createSchedule);
router.get("/get/:id", isAuth(), scheduleController.getSingleSchedule);
router.get("/get-all", isAuth(), scheduleController.getAllSchedules);
router.put("/update/:id", isAuth([Role.DOCTOR,Role.ADMIN]), scheduleController.updateSchedule);
router.delete("/delete/:id", isAuth([Role.DOCTOR, Role.ADMIN]), scheduleController.deleteSchedule);

export const scheduleRoutes = router;
