export interface User {
    id: number;
    email: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserCreateData {
    email: string;
    name: string;
}

export interface UserUpdateData {
    email?: string;
    name?: string;
}
