import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import isAuth from "../../middleware/isAuth";
import { Role } from "../../types/schema.types";
import validateRequest from "../../middleware/validateRequest";
import { appointmentZodValidate } from "./appointment.validation";

const router = Router();

router.post(
  "/",
  isAuth([Role.ADMIN]),
  validateRequest(appointmentZodValidate.create),
  appointmentController.createAppointment,
);
router.get("/", isAuth(), appointmentController.getAllAppointments);
router.get("/:id", isAuth(), appointmentController.getAppointment);
router.put(
  "/:id",
  isAuth([Role.ADMIN]),
  validateRequest(appointmentZodValidate.update),
  appointmentController.updateAppointment,
);
router.delete("/:id", isAuth([Role.ADMIN]), appointmentController.deleteAppointment);

export const appointmentRoutes = router;
