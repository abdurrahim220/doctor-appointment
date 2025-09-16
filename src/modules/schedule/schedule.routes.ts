import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import isAuth from "../../middleware/isAuth";
import { Role } from "../../types/schema.types";
import validateRequest from "../../middleware/validateRequest";
import { scheduleZodValidation } from "./schedule.validation";

const router = Router();

router.post("/create", isAuth([Role.DOCTOR]), validateRequest(scheduleZodValidation.scheduleZodSchema),scheduleController.createSchedule);
router.get("/get", isAuth(), scheduleController.getSchedule);
router.put("/update/:id", isAuth([Role.DOCTOR]), scheduleController.updateSchedule);
router.delete("/delete/:id", isAuth([Role.DOCTOR, Role.ADMIN]), scheduleController.deleteSchedule);

export const scheduleRoutes = router;
