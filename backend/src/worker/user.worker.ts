import { Worker } from 'bullmq';
import { queueConfig, QUEUE_NAMES } from '../config/queue.config.js';
import type { UserJobs } from '../queue/user.queue.js';

/**
 * User Worker (Consumer)
 * Bu process arka planda job'ları işler (email, event, audit, vs.)
 */
export function startUserWorker(): Worker<UserJobs> {
  const worker = new Worker<UserJobs>(
    QUEUE_NAMES.user,
    async (job) => {
      switch (job.name) {
        case 'user.created': {
          // örnek async işlem: mail gönderme / analytics / audit log
          // burada gerçek bir mail servisi entegre edebilirsin
          console.log('[worker] user.created received', job.data);
          return { ok: true };
        }
        default:
          throw new Error(`Unknown job: ${job.name}`);
      }
    },
    { connection: queueConfig.connection }
  );

  worker.on('completed', (job) => {
    console.log(`[worker] ✅ completed job=${job.id} name=${job.name}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[worker] ❌ failed job=${job?.id} name=${job?.name}`, err);
  });

  return worker;
}

