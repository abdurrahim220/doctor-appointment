import { Router } from "express";
import { postController } from "./post.controller";
import { postValidation } from "./post.validation";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

router.post("/", validateRequest(postValidation.postZodSchema), postController.createPost);
router.get("/", postController.getAllPost);
router.get("/:id", postController.getPostById);
router.put("/:id", validateRequest(postValidation.postUpdateZodSchema), postController.updatePost);
router.delete("/:id", postController.deletePost);

export const postRoutes = router;
