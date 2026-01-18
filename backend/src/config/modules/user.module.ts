import { container } from '../container.js';
import { UserRepository } from '../../repository/user.repository.js';
import { UserService } from '../../service/user.service.js';
import { UserController } from '../../controller/user.controller.js';

/**
 * User Module - Feature-based DI registration
 * Her feature için ayrı module oluştur
 * 30 feature = 30 module (her biri kendi bağımlılıklarını yönetir)
 */
export function registerUserModule(): void {
    // 1. Repositories (bağımlılık yok)
    const userRepository = new UserRepository();
    container.register('UserRepository', userRepository);

    // 2. Services (repositories'e bağımlı)
    const userService = new UserService(userRepository);
    container.register('UserService', userService);

    // 3. Controllers (services'e bağımlı)
    const userController = new UserController(userService);
    container.register('UserController', userController);
    container.register('userController', userController); // lowercase for routes
}
