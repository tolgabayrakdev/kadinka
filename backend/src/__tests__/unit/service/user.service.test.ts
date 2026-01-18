/**
 * UserService Unit Tests
 * Service katmanının unit testleri
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../../../service/user.service.js';
import { UserRepository } from '../../../repository/user.repository.js';
import { NotFoundException, ConflictException } from '../../../exception/http.exception.js';
import type { User, UserCreateData, UserUpdateData } from '../../../model/user.model.js';
import { MockUserRepository, mockUser, mockUsers } from '../../mocks/user.repository.mock.js';

describe('UserService', () => {
    let userService: UserService;
    let mockRepository: MockUserRepository;

    beforeEach(() => {
        // Her test öncesi yeni mock repository oluştur
        mockRepository = new MockUserRepository();
        // UserService'i mock repository ile oluştur
        userService = new UserService(mockRepository as unknown as UserRepository);
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = await userService.getAllUsers();
            
            expect(users).toBeDefined();
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBeGreaterThan(0);
        });

        it('should return empty array if no users exist', async () => {
            // Mock repository'yi boş döndürecek şekilde ayarla
            vi.spyOn(mockRepository, 'findAll').mockResolvedValueOnce([]);
            
            const users = await userService.getAllUsers();
            
            expect(users).toEqual([]);
        });
    });

    describe('getUserById', () => {
        it('should return user when user exists', async () => {
            const user = await userService.getUserById(1);
            
            expect(user).toBeDefined();
            expect(user.id).toBe(1);
            expect(user.email).toBe('test@example.com');
        });

        it('should throw NotFoundException when user does not exist', async () => {
            await expect(userService.getUserById(999)).rejects.toThrow(NotFoundException);
            await expect(userService.getUserById(999)).rejects.toThrow('User with id 999 not found');
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const newUserData: UserCreateData = {
                email: 'newuser@example.com',
                name: 'New User',
            };

            const user = await userService.createUser(newUserData);
            
            expect(user).toBeDefined();
            expect(user.email).toBe(newUserData.email);
            expect(user.name).toBe(newUserData.name);
        });

        it('should throw ConflictException when email already exists', async () => {
            const existingUserData: UserCreateData = {
                email: 'test@example.com', // Mevcut email
                name: 'Another User',
            };

            await expect(userService.createUser(existingUserData)).rejects.toThrow(ConflictException);
            await expect(userService.createUser(existingUserData)).rejects.toThrow('Email already exists');
        });
    });

    describe('updateUser', () => {
        it('should update user when user exists', async () => {
            const updateData: UserUpdateData = {
                name: 'Updated Name',
            };

            const updatedUser = await userService.updateUser(1, updateData);
            
            expect(updatedUser).toBeDefined();
            expect(updatedUser.id).toBe(1);
            expect(updatedUser.name).toBe('Updated Name');
        });

        it('should throw NotFoundException when user does not exist', async () => {
            const updateData: UserUpdateData = {
                name: 'Updated Name',
            };

            await expect(userService.updateUser(999, updateData)).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when email already exists for another user', async () => {
            const updateData: UserUpdateData = {
                email: 'user2@example.com', // Başka bir kullanıcının email'i
            };

            await expect(userService.updateUser(1, updateData)).rejects.toThrow(ConflictException);
            await expect(userService.updateUser(1, updateData)).rejects.toThrow('Email already exists');
        });

        it('should allow updating with same email for same user', async () => {
            const updateData: UserUpdateData = {
                email: 'test@example.com', // Kendi email'i
                name: 'Updated Name',
            };

            const updatedUser = await userService.updateUser(1, updateData);
            
            expect(updatedUser).toBeDefined();
            expect(updatedUser.email).toBe('test@example.com');
        });
    });

    describe('deleteUser', () => {
        it('should delete user when user exists', async () => {
            await expect(userService.deleteUser(1)).resolves.not.toThrow();
        });

        it('should throw NotFoundException when user does not exist', async () => {
            await expect(userService.deleteUser(999)).rejects.toThrow(NotFoundException);
        });
    });
});
