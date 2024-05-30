const express = require("express");
const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
} = require("../controllers/auth.controller");
const {
	getUpdateById,
	createUpdate,
	getUpdates,
	getUpdate,
	deleteUpdate,
} = require("../controllers/update.controller");
const { getUserById } = require("../controllers/user.controller");
const router = express.Router();

// param
router.param("userId", getUserById);
router.param("updateId", getUpdateById);

// create update
router.post(
	"/create/update",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createUpdate
);

// all updates
router.get("/updates", isSignedIn, getUpdates);

//get a particular update
router.get("/updates/:updateId", isSignedIn, getUpdate);

// delete update
router.delete(
	"/delete/update/:userId/:updateId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	deleteUpdate
);

module.exports = router;
