const { QueueEventJobPattern } = require("./job.pattern");

exports.PostCreatedJob = {
  pattern: QueueEventJobPattern.POST_CREATED,
  data: {
    postId: "",
  },
};
