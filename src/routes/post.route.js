const express = require("express");
const {
  createPost,
  allposts,
  getAllPostByUser,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
} = require("../controllers/post.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

// // post route - create
router.post("/posts", AuthMiddleware, createPost);

// // get all posts - read all
router.get("/posts", AuthMiddleware, allposts);

// all posts created by me
router.get("/posts/me", AuthMiddleware, getAllPostByUser);

//get the posts by id
router.get("/posts/:postId", AuthMiddleware, getPostById);

// // update post
router.patch("/posts/:postId", AuthMiddleware, updatePost);

// delete post
router.delete("/posts/:postId", AuthMiddleware, deletePost);

// // Like a post
router.patch("/posts/:postId/like", AuthMiddleware, likePost);

// // Unlike a post
router.patch("/posts/:postId/unlike", AuthMiddleware, unlikePost);

// comment on post
router.patch("/posts/:postId/comments", AuthMiddleware, commentPost);

module.exports = router;
