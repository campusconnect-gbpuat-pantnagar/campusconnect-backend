const { HttpStatusCode } = require("../enums/http-status-code.enum");
const Post = require("../models/Post");
const { globalConstants } = require("../utils/constants");

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


exports.createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const newPost = new Post({ userId, content, media });
    const post = await newPost.save();

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
