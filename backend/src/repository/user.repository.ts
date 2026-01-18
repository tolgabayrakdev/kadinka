import type { PoolClient } from 'pg';
import { query, getClient } from '../config/database.js';
import type { User, UserCreateData, UserUpdateData } from '../model/user.model.js';

export class UserRepository {
    async findAll(client?: PoolClient): Promise<User[]> {
        const sql = 'SELECT * FROM users ORDER BY created_at DESC';
        const executor = client || { query };
        const result = await executor.query(sql);
        return result.rows;
    }

    async findById(id: number, client?: PoolClient): Promise<User | null> {
        const sql = 'SELECT * FROM users WHERE id = $1';
        const executor = client || { query };
        const result = await executor.query(sql, [id]);
        return result.rows[0] || null;
    }

    async findByEmail(email: string, client?: PoolClient): Promise<User | null> {
        const sql = 'SELECT * FROM users WHERE email = $1';
        const executor = client || { query };
        const result = await executor.query(sql, [email]);
        return result.rows[0] || null;
    }

    async create(userData: UserCreateData, client?: PoolClient): Promise<User> {
        const sql = `
      INSERT INTO users (email, name, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
    `;
        const executor = client || { query };
        const result = await executor.query(sql, [userData.email, userData.name]);
        return result.rows[0];
    }

    async update(id: number, userData: UserUpdateData, client?: PoolClient): Promise<User | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        let paramCount = 1;

        if (userData.email !== undefined) {
            fields.push(`email = $${paramCount++}`);
            values.push(userData.email);
        }

        if (userData.name !== undefined) {
            fields.push(`name = $${paramCount++}`);
            values.push(userData.name);
        }

        if (fields.length === 0) return this.findById(id, client);

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const sql = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

        const executor = client || { query };
        const result = await executor.query(sql, values);
        return result.rows[0] || null;
    }

    async delete(id: number, client?: PoolClient): Promise<boolean> {
        const sql = 'DELETE FROM users WHERE id = $1';
        const executor = client || { query };
        const result = await executor.query(sql, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await getClient();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}