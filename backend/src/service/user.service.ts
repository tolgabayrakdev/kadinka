import { UserRepository } from '../repository/user.repository.js';
import type { User, UserCreateData, UserUpdateData } from '../model/user.model.js';
import { NotFoundException, ConflictException } from '../exception/http.exception.js';
import { userQueue } from '../queue/user.queue.js';

export class UserService {
    constructor(private userRepository: UserRepository) { }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async createUser(userData: UserCreateData): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const created = await this.userRepository.create(userData);

        // async işlem: kuyruğa job at (email, audit log, vs.)
        await userQueue.add(
            'user.created',
            { userId: created.id, email: created.email, name: created.name },
            { attempts: 3, backoff: { type: 'exponential', delay: 1000 } }
        );

        return created;
    }

    async updateUser(id: number, userData: UserUpdateData): Promise<User> {
        await this.getUserById(id);

        if (userData.email) {
            const existingUser = await this.userRepository.findByEmail(userData.email);
            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email already exists');
            }
        }

        const updatedUser = await this.userRepository.update(id, userData);
        if (!updatedUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return updatedUser;
    }

    async deleteUser(id: number): Promise<void> {
        await this.getUserById(id);
        await this.userRepository.delete(id);
    }
}