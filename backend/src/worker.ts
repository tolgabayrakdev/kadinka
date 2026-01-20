import dotenv from 'dotenv';
import { startUserWorker } from './worker/user.worker.js';

dotenv.config();

// Worker process entrypoint (Spring Boot'ta ayrı background service gibi)
startUserWorker();

console.log('🧵 Worker started');

