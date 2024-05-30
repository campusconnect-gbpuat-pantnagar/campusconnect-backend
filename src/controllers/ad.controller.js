const Ads = require("../models/Ads");

exports.getAdById = (req, res, next, Id) => {
  Ads.findById(Id).exec((err, ad) => {
    if (err) {
      return res.status(400).json({
        errorMsg: "An error occured",
      });
    }
    if (!ad) {
      return res.status(400).json({
        errorMsg: "Ad not found",
      });
    }
    req.ads = ad;
    next();
  });
};

//Create an Ad
exports.createAds = (req, res) => {
  const { user, title, content, price, contact } = req.body;
  const files = req.files;
  const picture = [];
  for (let i = 0; i < files.length; i++) {
    picture[i] = files[i].path;
  }
  const newAd = Ads({ user, title, content, contact, price, picture });
  newAd.save((err, ad) => {
    if (err) {
      res.status(400).json("error");
    }
    return res.status(200).json(ad);
  });
};

//Read all ads
exports.allAds = (req, res) => {
  Ads.find()
    .populate("user") // Add this line to populate the user details
    .sort({ createdAt: -1 })
    .exec((err, ads) => {
      if (err) {
        return res.status(400).json({
          errorMsg: "An error occurred",
        });
      }
      return res.json(ads);
    });
};

//Read a particular ad
exports.getAd = (req, res) => {
  // Ads.find({_id: req.ads._id}).exec((err, ad) => {
  //     if (err) {
  //       res.status(400).json("error")
  //     }
  //     return res.json(ad)
  // })
  return res.json(req.ads);
};

//Update an Ad
exports.updateAd = (req, res) => {
  const { user, title, content, contact, price } = req.body;
  const files = req.files;
  const picture = [];
  for (let i = 0; i < files.length; i++) {
    picture[i] = files[i].path;
  }
  const updateObj = { user, title, content, price, contact, picture };

  Ads.findByIdAndUpdate(
    { _id: req.ads._id },
    { $set: updateObj },
    { useFindAndModify: false, new: true },
    (err, ad) => {
      if (err || !ad) {
        return res.status(400).json({
          error: "An error occured,  try again later",
        });
      }
      return res.status(200).json(ad);
    }
  );
};

//delete an ad
exports.deleteAd = (req, res) => {
  Ads.findByIdAndRemove(
    { _id: req.ads._id },
    { useFindAndModify: false },
    (err, ad) => {
      if (err || !ad) {
        return res.status(400).json({
          errorMsg: "An error occurred, try again later",
        });
      }

      // After successful deletion, fetch all ads and return them to the client
      Ads.find({}, (err, ads) => {
        if (err) {
          return res.status(400).json({
            errorMsg: "An error occurred while fetching blogs",
          });
        }

        return res.status(200).json({
          message: "Ad has been deleted",
          updatedAds: ads, // Send the updated list of ads back to the client
        });
      });
    }
  );
};

exports.getAllAdsByUser = (req, res) => {
  Ads.find({ user: req.profile._id })
    .populate("user upvotes.user comments.user")
    .sort({ createdAt: -1 })
    .exec((err, ads) => {
      if (err) {
        return res
          .json(400)
          .json({ errorMsg: "An error occured, try again later" });
      }
      res.status(200).json(ads);
    });
};
