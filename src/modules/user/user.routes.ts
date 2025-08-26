// src/modules/user/user.routes.ts
import { Router } from 'express';
import { userController } from './user.controller';
import { userValidation } from './user.validation';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.post('/', validateRequest(userValidation.userZodSchema), userController.createUser);
router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.put('/:id', validateRequest(userValidation.updateUserZodSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export const userRoutes = router;