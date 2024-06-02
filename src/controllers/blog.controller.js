const Blog = require("../models/Blogs");
const { HttpStatusCode } = require("../enums/http-status-code.enum");
const { globalConstants } = require("../utils/constants");

exports.getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).exec();

    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        status: globalConstants.status.failed,
        message: `Blog not found !!`,
        error: globalConstants.statusCode.NotFoundException.statusCodeName,
        statusCode: globalConstants.statusCode.NotFoundException.code,
      });
    }

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `Get blog by blogId: ${blogId}`,
      data: blog,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to fetch blog",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

//create blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, link, media } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const newBlog = new Blog({ userId, title, content, link, media });
    const blog = await newBlog.save();

    return res.status(HttpStatusCode.CREATED).json({
      status: globalConstants.status.success,
      message: "Blog created successfully",
      data: blog,
      statusCode: globalConstants.statusCode.HttpsStatusCodeCreated.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to create blog",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// read all blogs
exports.allblogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All blogs retrieved successfully",
      data: blogs,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to retrieve blogs",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// update blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, link, media } = req.body;
    const userId = req.user.id;
    const { blogId } = req.params;
    const updateObj = { title, content, link, media };

    let blog = await Blog.findOne({ _id: blogId }).exec();
    if (!blog._id || blog.userId.toString() !== userId.toString()) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        status: globalConstants.status.failed,
        message: `Blog not found`,
        error: globalConstants.statusCode.ForbiddenException.statusCodeName,
        statusCode: globalConstants.statusCode.ForbiddenException.code,
      });
    }

    blog = await Blog.findOneAndUpdate(
      { _id: blogId, userId },
      { $set: updateObj },
      { useFindAndModify: false, new: true }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "Blog updated successfully..",
      data: blog,
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

//delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blogId } = req.params;

    let blog = await Blog.findOne({ _id: blogId }).exec();

    if (!blog || blog.userId.toString() !== userId.toString()) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        status: globalConstants.status.failed,
        message: `Blog not found or you don't have permission to delete it`,
        error: globalConstants.statusCode.ForbiddenException.statusCodeName,
        statusCode: globalConstants.statusCode.ForbiddenException.code,
      });
    }

    blog = await Blog.findOneAndRemove(
      { _id: blogId, userId },
      { useFindAndModify: false }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "Blog deleted successfully",
      data: blog,
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

// Upvote a blog
exports.upvoteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blogId } = req.params;

    let blog = await Blog.findOne({ _id: blogId }).exec();
    if (!blog) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: globalConstants.status.failed,
        message: `Blog not found `,
        error: globalConstants.statusCode.BadRequestException.statusCodeName,
        statusCode: globalConstants.statusCode.BadRequestException.code,
      });
    }

    const result = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: {
          upvotes: userId,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `${userId} upvoted the blog!!`,
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

// Downvote a blog
exports.downvoteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blogId } = req.params;

    let blog = await Blog.findOne({ _id: blogId }).exec();
    if (!blog) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: globalConstants.status.failed,
        message: `Blog not found `,
        error: globalConstants.statusCode.BadRequestException.statusCodeName,
        statusCode: globalConstants.statusCode.BadRequestException.code,
      });
    }

    const result = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          upvotes: userId,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `${userId} downvoted the blog!!`,
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

// comment on a blog
exports.commentBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    const { blogId } = req.params;

    let blog = await Blog.findOne({ _id: blogId }).exec();
    if (!blog) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: globalConstants.status.failed,
        message: `Blog not found `,
        error: globalConstants.statusCode.BadRequestException.statusCodeName,
        statusCode: globalConstants.statusCode.BadRequestException.code,
      });
    }

    const result = await Blog.findByIdAndUpdate(
      blogId,
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
      message: `${userId} comment on blog!!`,
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

exports.countShareBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blogId } = req.params;

    let blog = await Blog.findOne({ _id: blogId }).exec();
    if (!blog) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: globalConstants.status.failed,
        message: `Blog not found `,
        error: globalConstants.statusCode.BadRequestException.statusCodeName,
        statusCode: globalConstants.statusCode.BadRequestException.code,
      });
    }

    const result = await Blog.findById(blogId).exec((err, blog) => {
      blog.shareCount++;
      blog.save();
    });

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `${userId} shared the blog!!`,
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

exports.getAllBlogByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await Blog.find({ userId }).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All blogs",
      data: blogs,
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
exports.getAllBlogByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const blogs = await Blog.find({ userId }).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All blogs",
      data: blogs,
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
