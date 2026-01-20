import { Queue } from 'bullmq';
import { queueConfig, QUEUE_NAMES } from '../config/queue.config.js';

export type UserJobs = {
  'user.created': {
    userId: number;
    email: string;
    name: string;
  };
};

export const userQueue = new Queue<UserJobs>(QUEUE_NAMES.user, {
  connection: queueConfig.connection,
});

