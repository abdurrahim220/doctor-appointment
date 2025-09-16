import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { postRoutes } from "../modules/post/post.routes";
import { authRouter } from "../modules/auth/auth.route";
import { doctorProfileRouter } from "../modules/user/doctor/doctor.routes";
import { nurseProfileRouter } from "../modules/user/nurse/nurse.routes";
import { patientProfileRoutes } from "../modules/user/patient-profiles/patient.profile.route";
import { clinicRoutes } from "../modules/clinic/clinic.routes";
import { scheduleRoutes } from "../modules/schedule/schedule.routes";

const router = Router();

const routerModule = [
  {
    path: "/user",
    router: userRoutes,
  },
  {
    path: "/patient-profile",
    router: patientProfileRoutes,
  },
  {
    path: "/doctor-profile",
    router: doctorProfileRouter,
  },
  {
    path: "/nurse-profile",
    router: nurseProfileRouter,
  },
  {
    path: "/post",
    router: postRoutes,
  },
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/clinic",
    router: clinicRoutes,
  },
  {
    path: "/schedule",
    router: scheduleRoutes,
  },
];
routerModule.forEach((route) => {
  router.use(route.path, route.router);
});
export default router;
