const Blog = require("../models/Blogs");

exports.getBlogById = (req, res, next, Id) => {
  Blog.findById(Id)
    .populate("user upvotes.user comments.user")
    .exec((err, blog) => {
      if (err) {
        return res.status(400).json({
          errorMsg: "An error occured",
        });
      }
      if (!blog) {
        return res.status(400).json({
          errorMsg: "Blog not found",
        });
      }
      blog.user.salt = undefined;
      blog.user.encryptedpassword = undefined;
      req.blogs = blog;
      next();
    });
};

//create blog
exports.createBlog = (req, res) => {
  const { user, title, content, link } = req.body;
  var picture;
  if (req.file) {
    picture = req.file.path;
  }
  const newBlog = Blog({ user, title, content, picture, link });
  newBlog.save((err, blog) => {
    if (err) {
      res.status(400).json({
        errorMsg: "An error occured",
      });
    }
    return res.status(200).json(blog);
  });
};

// read all blogs
exports.allblogs = (req, res) => {
  Blog.find()
    .populate("user upvotes.user comments.user")
    .sort({ createdAt: -1 })
    .exec((err, blogs) => {
      if (err) {
        res.status(400).json({
          errorMsg: "An error occured",
        });
      }

      blogs.map((blog) => {
        blog.user.salt = undefined;
        blog.user.encryptedpassword = undefined;
      });
      return res.json(blogs);
    });
};

//Read a particular blog
exports.getBlog = (req, res) => {
  Blog.find({ _id: req.blogs._id }).exec((err, blog) => {
    if (err) {
      res.status(400).json({
        errorMsg: "An error occured",
      });
    }
    return res.json(blog);
  });
};

// update blog
exports.updateBlog = (req, res) => {
  const { user, title, content, link } = req.body;
  var picture;
  if (req.file) {
    picture = req.file.path;
  }
  const updateObj = { user, title, content, picture, link };

  Blog.findByIdAndUpdate(
    { _id: req.blogs._id },
    { $set: updateObj },
    { useFindAndModify: false, new: true },
    (err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          error: "An error occured,  try again later",
        });
      }
      return res.status(200).json(blog);
    }
  );
};

//delete a blog
exports.deleteBlog = (req, res) => {
  Blog.findByIdAndRemove(
    { _id: req.blogs._id },
    { useFindAndModify: false },
    (err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          errorMsg: "An error occurred, try again later",
        });
      }

      // After successful deletion, fetch all posts and return them to the client
      Blog.find({}, (err, blogs) => {
        if (err) {
          return res.status(400).json({
            errorMsg: "An error occurred while fetching blogs",
          });
        }

        return res.status(200).json({
          message: "Blog has been deleted",
          updatedBlogs: blogs, // Send the updated list of posts back to the client
        });
      });
    }
  );
};

// Upvote a blog
exports.upvoteBlog = (req, res) => {
  Blog.findByIdAndUpdate(
    { _id: req.blogs._id },
    {
      $push: { upvotes: req.profile._id },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  ).exec((err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    } else {
      res.status(200).json(result);
    }
  });
};

// Downvote a blog
exports.downvoteBlog = (req, res) => {
  Blog.findByIdAndUpdate(
    { _id: req.blogs._id },
    {
      $pull: { upvotes: req.profile._id },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  ).exec((err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    } else {
      res.status(200).json(result);
    }
  });
};

// comment on a blog
exports.commentBlog = (req, res) => {
  Blog.findByIdAndUpdate(
    { _id: req.blogs._id },
    {
      $push: {
        comments: { user: req.profile._id, text: req.body.text },
      },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.countShareBlog = (req, res) => {
  Blog.findById({ _id: req.blogs._id }).exec((err, blog) => {
    if (err) {
      return res
        .status(400)
        .json({ errorMsg: "An error occured, try again later" });
    }

    blog.shareCount++;
    blog.save();
    res.json(blog);
  });
};

exports.getAllBlogByUser = (req, res) => {
  Blog.find({ user: req.profile._id })
    .populate("user upvotes.user comments.user")
    .sort({ createdAt: -1 })
    .exec((err, blogs) => {
      if (err) {
        return res
          .json(400)
          .json({ errorMsg: "An error occured, try again later" });
      }
      res.status(200).json(blogs);
    });
};
