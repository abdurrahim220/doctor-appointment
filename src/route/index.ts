import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { postRoutes } from "../modules/post/post.routes";
import { authRouter } from "../modules/auth/auth.route";
import { subUserRoutes } from "../modules/user/user-profiles/patient.profile.route";
import { doctorProfileRouter } from "../modules/user/doctor/doctor.routes";
import { nurseProfileRouter } from "../modules/user/nurse/nurse.routes";

const router = Router();

const routerModule = [
  {
    path: "/user",
    router: userRoutes,
  },
  {
    path: "/user-profile",
    router: subUserRoutes,
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
];
routerModule.forEach((route) => {
  router.use(route.path, route.router);
});
export default router;
