const express = require("express");

const {
  getFeedbackById,
  createFeedback,
  allFeedbacks,
} = require("../controllers/feedback.controller");
const { AuthMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

//create feedback
router.post("/feedbacks", AuthMiddleware, createFeedback);

// Admin routes
// get all feedbacks
router.get("/feedbacks", AuthMiddleware, isAdmin, allFeedbacks);

//get a particular feedback
router.get("/feedbacks/:feedbackId", AuthMiddleware, isAdmin, getFeedbackById);

module.exports = router;
