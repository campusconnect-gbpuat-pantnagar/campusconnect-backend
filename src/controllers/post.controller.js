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
