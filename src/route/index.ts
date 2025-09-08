import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { postRoutes } from "../modules/post/post.routes";
import { authRouter } from "../modules/auth/auth.route";
import { subUserRoutes } from "../modules/user/user-profiles/user.profile.route";

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
