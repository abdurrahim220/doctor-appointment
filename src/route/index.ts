import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { postRoutes } from "../modules/post/post.routes";

const router = Router();

const routerModule = [
  {
    path: "/user",
    router: userRoutes,
  },
  {
    path: "/post",
    router: postRoutes,
  },
];
routerModule.forEach((route) => {
  router.use(route.path, route.router);
});
export default router;
