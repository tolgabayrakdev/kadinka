/**
 * UserController Unit Tests
 * Controller katmanının unit testleri
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { UserController } from '../../../controller/user.controller.js';
import { UserService } from '../../../service/user.service.js';
import { NotFoundException, ConflictException } from '../../../exception/http.exception.js';
import { mockUsers, mockUser } from '../../mocks/user.repository.mock.js';
import type { User } from '../../../model/user.model.js';

// Mock Express types
type MockRequest = Partial<Request> & {
    params?: Record<string, string>;
    body?: Record<string, unknown>;
};

type MockResponse = Partial<Response> & {
    statusCode?: number;
    jsonData?: unknown;
    sendData?: unknown;
};

describe('UserController', () => {
    let userController: UserController;
    let mockUserService: {
        getAllUsers: ReturnType<typeof vi.fn>;
        getUserById: ReturnType<typeof vi.fn>;
        createUser: ReturnType<typeof vi.fn>;
        updateUser: ReturnType<typeof vi.fn>;
        deleteUser: ReturnType<typeof vi.fn>;
    };
    let mockRequest: MockRequest;
    let mockResponse: MockResponse;
    let mockNext: NextFunction;

    beforeEach(() => {
        // Mock UserService
        mockUserService = {
            getAllUsers: vi.fn(),
            getUserById: vi.fn(),
            createUser: vi.fn(),
            updateUser: vi.fn(),
            deleteUser: vi.fn(),
        };

        userController = new UserController(mockUserService as unknown as UserService);

        // Mock Express Request, Response, NextFunction
        mockRequest = {
            params: {},
            body: {},
        };

        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        };

        mockNext = vi.fn();
    });

    describe('getAllUsers', () => {
        it('should return all users successfully', async () => {
            mockUserService.getAllUsers.mockResolvedValue(mockUsers);

            await userController.getAllUsers(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.getAllUsers).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockUsers,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Service error');
            mockUserService.getAllUsers.mockRejectedValue(error);

            await userController.getAllUsers(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
        it('should return user by id successfully', async () => {
            mockRequest.params = { id: '1' };
            mockUserService.getUserById.mockResolvedValue(mockUser);

            await userController.getUserById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser,
            });
        });

        it('should return 400 when id is invalid', async () => {
            mockRequest.params = { id: 'invalid' };

            await userController.getUserById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.getUserById).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid user ID',
            });
        });

        it('should call next with error when service throws NotFoundException', async () => {
            mockRequest.params = { id: '999' };
            const error = new NotFoundException('User not found');
            mockUserService.getUserById.mockRejectedValue(error);

            await userController.getUserById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('createUser', () => {
        it('should create user successfully', async () => {
            const newUser = { ...mockUser, id: 3, email: 'new@example.com' };
            mockRequest.body = { email: 'new@example.com', name: 'New User' };
            mockUserService.createUser.mockResolvedValue(newUser);

            await userController.createUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.createUser).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: newUser,
            });
        });

        it('should call next with error when service throws ConflictException', async () => {
            mockRequest.body = { email: 'test@example.com', name: 'Test' };
            const error = new ConflictException('Email already exists');
            mockUserService.createUser.mockRejectedValue(error);

            await userController.createUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const updatedUser = { ...mockUser, name: 'Updated Name' };
            mockRequest.params = { id: '1' };
            mockRequest.body = { name: 'Updated Name' };
            mockUserService.updateUser.mockResolvedValue(updatedUser);

            await userController.updateUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.updateUser).toHaveBeenCalledWith(1, mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: updatedUser,
            });
        });

        it('should return 400 when id is invalid', async () => {
            mockRequest.params = { id: 'invalid' };
            mockRequest.body = { name: 'Updated' };

            await userController.updateUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.updateUser).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            mockRequest.params = { id: '1' };
            mockUserService.deleteUser.mockResolvedValue(undefined);

            await userController.deleteUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('should return 400 when id is invalid', async () => {
            mockRequest.params = { id: 'invalid' };

            await userController.deleteUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.deleteUser).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should call next with error when service throws', async () => {
            mockRequest.params = { id: '999' };
            const error = new NotFoundException('User not found');
            mockUserService.deleteUser.mockRejectedValue(error);

            await userController.deleteUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
