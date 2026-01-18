/**
 * UserRepository Mock
 * Testlerde UserRepository'yi mock'lamak için
 */
import type { User, UserCreateData, UserUpdateData } from '../../model/user.model.js';

export const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
};

export const mockUsers: User[] = [
    mockUser,
    {
        id: 2,
        email: 'user2@example.com',
        name: 'User 2',
        created_at: new Date('2024-01-02'),
        updated_at: new Date('2024-01-02'),
    },
];

/**
 * Mock UserRepository class
 */
export class MockUserRepository {
    async findAll(): Promise<User[]> {
        return Promise.resolve(mockUsers);
    }

    async findById(id: number): Promise<User | null> {
        const user = mockUsers.find(u => u.id === id);
        return Promise.resolve(user || null);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = mockUsers.find(u => u.email === email);
        return Promise.resolve(user || null);
    }

    async create(userData: UserCreateData): Promise<User> {
        const newUser: User = {
            id: mockUsers.length + 1,
            ...userData,
            created_at: new Date(),
            updated_at: new Date(),
        };
        mockUsers.push(newUser);
        return Promise.resolve(newUser);
    }

    async update(id: number, userData: UserUpdateData): Promise<User | null> {
        const user = mockUsers.find(u => u.id === id);
        if (!user) return Promise.resolve(null);

        const updatedUser: User = {
            ...user,
            ...userData,
            updated_at: new Date(),
        };
        const index = mockUsers.findIndex(u => u.id === id);
        mockUsers[index] = updatedUser;
        return Promise.resolve(updatedUser);
    }

    async delete(id: number): Promise<boolean> {
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) return Promise.resolve(false);
        mockUsers.splice(index, 1);
        return Promise.resolve(true);
    }
}
