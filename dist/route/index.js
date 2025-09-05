"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const post_routes_1 = require("../modules/post/post.routes");
const router = (0, express_1.Router)();
const routerModule = [
    {
        path: "/user",
        router: user_routes_1.userRoutes,
    },
    {
        path: "/post",
        router: post_routes_1.postRoutes,
    },
];
routerModule.forEach((route) => {
    router.use(route.path, route.router);
});
exports.default = router;
