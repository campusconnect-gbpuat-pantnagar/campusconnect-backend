exports.checkQueueReadiness = async (queue) => {
  try {
    await queue.waitUntilReady();
    console.info(`Queue ${queue.name} is ready`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Queue ${queue.name} is not ready: ${error.message}`);
    } else {
      console.error(`Queue ${queue.name} is not ready: ${String(error)}`);
    }
    throw error;
  }
};
