import { Queue } from 'bullmq';
import { queueConfig, QUEUE_NAMES } from '../config/queue.config.js';

export type UserCreatedJob = {
  userId: number;
  email: string;
  name: string;
};

export type UserUpdatedJob = {
  userId: number;
  changedFields: string[];
};

export type UserJobs =
  | UserCreatedJob
  | UserUpdatedJob;

export const userQueue = new Queue<UserJobs>(
  QUEUE_NAMES.user,
  {
    connection: queueConfig.connection,
  }
);
