import { Router } from 'express';
import { validate } from '../middleware/validation.middleware.js';
import { createUserSchema, updateUserSchema } from '../dto/user.dto.js';
import { container } from '../config/container.js';
import { UserController } from '../controller/user.controller.js';

/**
 * User Routes Factory
 * Container initialize edildikten sonra controller'ı alır
 */
function createUserRoutes() {
    const router = Router();
    const userController = container.get<UserController>('userController');

    router.get('/', userController.getAllUsers);
    router.get('/:id', userController.getUserById);
    router.post('/', validate(createUserSchema), userController.createUser);
    router.put('/:id', validate(updateUserSchema), userController.updateUser);
    router.delete('/:id', userController.deleteUser);

    return router;
}

export default createUserRoutes;
