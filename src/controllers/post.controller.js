const { HttpStatusCode } = require("../enums/http-status-code.enum");
const {
  CONTENT_MODERATION_QUEUE,
} = require("../libraries/queues/content-moderation.queue");
const {
  QueueEventJobPattern,
} = require("../libraries/queues/jobs/job.pattern");
const { JobPriority } = require("../libraries/queues/jobs/job.priority");
const Post = require("../models/Post");
const { globalConstants } = require("../utils/constants");

/* The `exports.getPostById` function is responsible for fetching a post by its ID. Here's a breakdown
of what the function does: */
exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).exec();

    if (!post) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        status: globalConstants.status.failed,
        message: `Post not found !!`,
        error: globalConstants.statusCode.NotFoundException.statusCodeName,
        statusCode: globalConstants.statusCode.NotFoundException.code,
      });
    }

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `Get post by postId: ${postId}`,
      data: post,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to fetch post",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

/* The `exports.createPost` function is responsible for creating a new post. Here's a breakdown of what
the function does: */
exports.createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const newPost = new Post({ userId, content, media });
    const post = await newPost.save();

    // trigger the post creation event for content moderation service
    const eventData = {
      postId: newPost._id,
    };

    await CONTENT_MODERATION_QUEUE.add(
      QueueEventJobPattern.POST_CREATED,
      { ...eventData },
      { priority: JobPriority.HIGHEST }
    );
    console.log(eventData, "triggering post creation event");
    return res.status(HttpStatusCode.CREATED).json({
      status: globalConstants.status.success,
      message: "Post created successfully",
      data: post,
      statusCode: globalConstants.statusCode.HttpsStatusCodeCreated.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to create post",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

exports.allposts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All posts retrieved successfully",
      data: posts,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to retrieve posts",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// update post
exports.updatePost = async (req, res) => {
  try {
    const { content, media } = req.body;
    const userId = req.user.id;
    const { postId } = req.params;
    const updateObj = { content, media };

    let post = await Post.findOne({ _id: postId }).exec();
    if (!post._id || post.userId.toString() !== userId.toString()) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        status: globalConstants.status.failed,
        message: `Post not found`,
        error: globalConstants.statusCode.ForbiddenException.statusCodeName,
        statusCode: globalConstants.statusCode.ForbiddenException.code,
      });
    }

    post = await Post.findOneAndUpdate(
      { _id: postId, userId },
      { $set: updateObj },
      { useFindAndModify: false, new: true }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "post updated successfully..",
      data: post,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// delete post
exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    let post = await Post.findOne({ _id: postId }).exec();

    if (!post || post.userId.toString() !== userId.toString()) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        status: globalConstants.status.failed,
        message: `Post not found or you don't have permission to delete it`,
        error: globalConstants.statusCode.ForbiddenException.statusCodeName,
        statusCode: globalConstants.statusCode.ForbiddenException.code,
      });
    }

    post = await Post.findOneAndRemove(
      { _id: postId, userId },
      { useFindAndModify: false }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "Post deleted successfully",
      data: post,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// Like post
exports.likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    let post = await Post.findOne({ _id: postId }).exec();
    if (!post) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: globalConstants.status.failed,
        message: `Post not found `,
        error: globalConstants.statusCode.BadRequestException.statusCodeName,
        statusCode: globalConstants.statusCode.BadRequestException.code,
      });
    }

    const result = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: { userId: userId } } },
      { new: true, useFindAndModify: false }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `${userId} liked the post!!`,
      data: result,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// Unlike post
exports.unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    let post = await Post.findOne({ _id: postId }).exec();
    if (!post) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: globalConstants.status.failed,
        message: `Post not found `,
        error: globalConstants.statusCode.BadRequestException.statusCodeName,
        statusCode: globalConstants.statusCode.BadRequestException.code,
      });
    }

    const result = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: { userId: userId } } },
      { new: true, useFindAndModify: false }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `${userId} unliked the post!!`,
      data: result,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

exports.getAllPostByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All posts",
      data: posts,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// comment on a post
exports.commentPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    const { postId } = req.params;

    let post = await Post.findOne({ _id: postId }).exec();
    if (!post) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: globalConstants.status.failed,
        message: `Post not found `,
        error: globalConstants.statusCode.BadRequestException.statusCodeName,
        statusCode: globalConstants.statusCode.BadRequestException.code,
      });
    }

    const result = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: { userId: userId, text: text },
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `${userId} comment on post!!`,
      data: result,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};
