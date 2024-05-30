const express = require("express");
const {
  getAdById,
  createAds,
  allAds,
  updateAd,
  deleteAd,
  getAd,
  commentAd,
  likeAd,
  unlikeAd,
  getAllAdsByUser,
} = require("../controllers/ad.controller");
const { AuthMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

// create ads
router.post("/ads/", AuthMiddleware, createAds);

// get all ads - read all
router.get("/ads", AuthMiddleware, allAds);

//get a particular ad
router.get("/ads/:adId", AuthMiddleware, getAd);

// update ad
router.put("/ads/:adId", AuthMiddleware, updateAd);

// delete ad
router.delete("/ads/:adId", AuthMiddleware, deleteAd);

// Like an ad
router.put("/ads/:adId/like", AuthMiddleware, likeAd);

// Unlike an ad
router.put("/ads/:adId/unlike", AuthMiddleware, unlikeAd);

// comment on an ad
router.put("/ads/:adId/comments", AuthMiddleware, commentAd);

router.get("/ads", AuthMiddleware, getAllAdsByUser);

module.exports = router;
