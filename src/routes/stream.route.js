const express = require("express");
const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
} = require("../controllers/auth.controller");
const {
	getStreamById,
	createStream,
	upload,
	allStreams,
	getStream,
	updateStream,
	deleteStream,
} = require("../controllers/stream.controller");
const { getUserById } = require("../controllers/user.controller");
const router = express.Router();

// param
router.param("userId", getUserById);
router.param("streamId", getStreamById);

// create stream
router.post(
	"/create/stream",
	isSignedIn,
	isAuthenticated,
	upload.array("picture", 10),
	isAdmin,
	createStream
);

// all streams
router.get("/streams", isSignedIn, allStreams);

//get a particular stream
router.get("/streams/:streamId", isSignedIn, getStream);

// update stream
router.put(
	"/update/stream/:userId/:streamId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	upload.array("picture", 10),
	updateStream
);

// delete stream
router.delete(
	"/delete/stream/:userId/:streamId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	deleteStream
);

module.exports = router;
