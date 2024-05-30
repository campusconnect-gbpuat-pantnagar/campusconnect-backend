const express = require("express");
const {
	getAdById,
	createAds,
	upload,
	allAds,
	updateAd,
	deleteAd,
	getAd,
	commentAd,
	likeAd,
	unlikeAd,
	getAllAdsByUser,
} = require("../controllers/ad.controller");
const {
	isSignedIn,
	isAuthenticated,
} = require("../controllers/auth.controller");
const { getUserById } = require("../controllers/user.controller");
const router = express.Router();

//param
router.param("userId", getUserById);
router.param("adId", getAdById);

// create ads
router.post(
	"/create/ad/:userId",
	isSignedIn,
	isAuthenticated,
	upload.array("picture", 5),
	createAds
);

// get all ads - read all
router.get("/ads", isSignedIn, allAds);

//get a particular ad
router.get("/ads/:adId", isSignedIn, getAd);

// update ad
router.put(
	"/update/ad/:userId/:adId",
	isSignedIn,
	isAuthenticated,
	upload.array("picture", 5),
	updateAd
);

// delete ad
router.delete(
	"/delete/ad/:userId/:adId",
	isSignedIn,
	isAuthenticated,
	deleteAd
);

// Like an ad
router.put("/ad/like/:userId/:adId", isSignedIn, isAuthenticated, likeAd);

// Unlike an ad
router.put("/ad/unlike/:userId/:adId", isSignedIn, isAuthenticated, unlikeAd);

// comment on an ad
router.put("/ad/comment/:userId/:adId", isSignedIn, isAuthenticated, commentAd);

router.get("/:userId/ads", isSignedIn, getAllAdsByUser)

module.exports = router;
