const { Queue } = require("bullmq");
const { EmailQueues } = require("./queue.constants");

exports.CONTENT_MODERATION_QUEUE = new Queue(
  EmailQueues.CONTENT_MODERATION_QUEUE,
  {
    connection: {
      host: process.env.REDIS_CONTENT_MODERATION_NOTIFICATION_HOST,
      port: process.env.REDIS_CONTENT_MODERATION_NOTIFICATION_PORT,
      username: process.env.REDIS_CONTENT_MODERATION_NOTIFICATION_USER,
      password: process.env.REDIS_CONTENT_MODERATION_NOTIFICATION_PASS,
    },
    defaultJobOptions: {
      removeOnComplete: true, // Remove job from the queue once it's completed
      attempts: 3, // Number of attempts before a job is marked as failed
      removeOnFail: {
        age: 200,
        count: 10,
      },
      backoff: {
        // Optional backoff settings for retrying failed jobs
        type: "exponential",
        delay: 60000, // Initial delay of 60 second
      },
    },
  }
);
