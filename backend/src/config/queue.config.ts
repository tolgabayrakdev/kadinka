import type { ConnectionOptions } from 'bullmq';

export const queueConfig = {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    // password: process.env.REDIS_PASSWORD,
  } satisfies ConnectionOptions,
} as const;

export const QUEUE_NAMES = {
  user: 'user-queue',
} as const;

