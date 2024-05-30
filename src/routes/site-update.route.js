const express = require("express");

const {
  getUpdateById,
  createUpdate,
  getUpdates,
  getUpdate,
  deleteUpdate,
} = require("../controllers/site-update.controller");
const { isAdmin, AuthMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// create update
router.post("/site-updates", AuthMiddleware, isAdmin, createUpdate);

// all updates
router.get("/site-updates", AuthMiddleware, getUpdates);

//get a particular update
router.get("/site-updates/:siteUpdateId", AuthMiddleware, getUpdate);

// delete update
router.delete(
  "/site-updates/:siteUpdateId",
  AuthMiddleware,
  isAdmin,
  deleteUpdate
);

module.exports = router;
