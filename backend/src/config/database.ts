import { Pool } from 'pg';
import type { PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fa',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: parseInt(process.env.DB_MAX_CLIENTS || '20'),
});

pool.on('connect', () => {
    console.log('Database connected');
});

pool.on('error', (err) => {
    console.error('Database error:', err);
});

export const query = async (text: string, params?: any[]) => {
    return await pool.query(text, params);
};

export const getClient = async (): Promise<PoolClient> => {
    return await pool.connect();
};

export const closePool = async (): Promise<void> => {
    await pool.end();
};

export default pool;