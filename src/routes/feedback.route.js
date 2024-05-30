const express = require("express");

const {
  getFeedbackById,
  createFeedback,
  allFeedbacks,
  getFeedback,
} = require("../controllers/feedback.controller");
const { AuthMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

// Admin routes
//create feedback
router.post("/feedbacks", AuthMiddleware, createFeedback);

// get all feedbacks
router.get("/feedbacks", AuthMiddleware, isAdmin, allFeedbacks);

//get a particular feedback
router.get("/feedbacks/:feedbackId", AuthMiddleware, isAdmin, getFeedback);

module.exports = router;
