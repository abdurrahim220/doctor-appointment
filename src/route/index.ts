import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";

const router = Router();

const routerModule = [
  {
    path: "/user",
    router: userRoutes,
  },
];
routerModule.forEach((route) => {
  router.use(route.path, route.router);
});
export default router;
