const express = require("express");

const {
  createBlog,
  allblogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  commentBlog,
  upvoteBlog,
  downvoteBlog,
  countShareBlog,
  getAllBlogByUser,
  getAllBlogByUserId,
} = require("../controllers/blog.controller");
const { AuthMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

// create blog
router.post("/blogs", AuthMiddleware, createBlog);

// all blogs
router.get("/blogs", AuthMiddleware, allblogs);
router.get("/blogs/me", AuthMiddleware, getAllBlogByUser);
router.get("/blogs/users/:userId", AuthMiddleware, getAllBlogByUserId);
//get a particular blog
router.get("/blogs/:blogId", AuthMiddleware, getBlogById);

// update blog
router.put("/blogs/:blogId", AuthMiddleware, updateBlog);

// delete blog
router.delete("/blogs/:blogId", AuthMiddleware, deleteBlog);

// upvote a blog
router.put("/blogs/:blogId/upvote", AuthMiddleware, upvoteBlog);

// Downvote a blog
router.put("/blogs/:blogId/downvote", AuthMiddleware, downvoteBlog);

// comment on a blog
router.put("/blogs/:blogId/comment", AuthMiddleware, commentBlog);

router.get("/blogs/:blogId/share", AuthMiddleware, countShareBlog);

module.exports = router;
