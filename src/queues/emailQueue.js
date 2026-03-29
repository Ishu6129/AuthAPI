import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendEmail } from '../services/email.service.js';
import config from "../config/config.js";

const connection = new IORedis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Create the queue
export const emailQueue = new Queue('emailQueue', { connection });

// Create the worker in the same process
new Worker(
  'emailQueue',
  async job => {
    const { to, subject, text, html } = job.data;
    await sendEmail(to, subject, text, html);
  },
  { connection }
);

console.log('Email queue + worker running in same process');