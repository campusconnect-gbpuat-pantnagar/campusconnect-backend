const express = require("express");
const {
  getAdById,
  createAds,
  allAds,
  updateAd,
  deleteAd,
  commentAd,
  likeAd,
  unlikeAd,
  getAllAdsByUserId,
  getAllAdsByUser,
} = require("../controllers/ad.controller");
const { AuthMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

// create ads
router.post("/ads", AuthMiddleware, createAds);

// get all ads - read all
router.get("/ads", AuthMiddleware, allAds);

router.get("/ads/me", AuthMiddleware, getAllAdsByUser);

router.get("/ads/users/:userId", AuthMiddleware, getAllAdsByUserId);

//get a particular ad
router.get("/ads/:adId", AuthMiddleware, getAdById);

// update ad
router.put("/ads/:adId", AuthMiddleware, updateAd);

// delete ad
router.delete("/ads/:adId", AuthMiddleware, deleteAd);

// Like an ad
// router.put("/ads/:adId/like", AuthMiddleware, likeAd);

// Unlike an ad
// router.put("/ads/:adId/unlike", AuthMiddleware, unlikeAd);

// comment on an ad
// router.put("/ads/:adId/comments", AuthMiddleware, commentAd);

module.exports = router;
