const express = require("express");

const {
  getNoticeById,
  createNotice,
  allNotices,
  updateNotice,
  deleteNotice,
} = require("../controllers/notice.controller");
const { AuthMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

// Public routes
// Get all notices
router.get("/notices", AuthMiddleware, allNotices);

// Get a particular notices by notice id
router.get("/notices/:noticeId", AuthMiddleware, getNoticeById);


// admin routes
// Create notice
router.post("/notices", AuthMiddleware, isAdmin, createNotice);

// Update notice
router.put("/notices/:noticeId", AuthMiddleware, isAdmin, updateNotice);

// Delete notice
router.delete("/notices/:noticeId", AuthMiddleware, isAdmin, deleteNotice);

module.exports = router;
