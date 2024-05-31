const Ads = require("../models/Ads");
const { HttpStatusCode } = require("../enums/http-status-code.enum");
const { globalConstants } = require("../utils/constants");

exports.getAdById = async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await Ads.findById(adId).exec();

    if (!ad) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        status: globalConstants.status.failed,
        message: `Ad not found !!`,
        error: globalConstants.statusCode.NotFoundException.statusCodeName,
        statusCode: globalConstants.statusCode.NotFoundException.code,
      });
    }

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `Get ad by adId: ${adId}`,
      data: ad,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to fetch ad",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

//Create an Ad
exports.createAds = async (req, res) => {
  try {
    const { title, content, price, contact, media } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const newAd = new Ads({ userId, title, content, price, contact, media });
    const ad = await newAd.save();

    return res.status(HttpStatusCode.CREATED).json({
      status: globalConstants.status.success,
      message: "Ad created successfully",
      data: ad,
      statusCode: globalConstants.statusCode.HttpsStatusCodeCreated.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to create ad",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

//Read all ads
exports.allAds = async (req, res) => {
  try {
    const ads = await Ads.find({}).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All ads retrieved successfully",
      data: ads,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to retrieve ads",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

//Update an Ad
exports.updateAd = async (req, res) => {
  try {
    const { title, content, price, contact, media } = req.body;
    const userId = req.user.id;
    const { adId } = req.params;
    const updateObj = { title, content, price, contact, media };

    let ad = await Ads.findOne({ _id: adId }).exec();
    if (!ad._id || ad.userId.toString() !== userId.toString()) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        status: globalConstants.status.failed,
        message: `Ad not found`,
        error: globalConstants.statusCode.ForbiddenException.statusCodeName,
        statusCode: globalConstants.statusCode.ForbiddenException.code,
      });
    }

    ad = await Ads.findOneAndUpdate(
      { _id: adId, userId },
      { $set: updateObj },
      { useFindAndModify: false, new: true }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "Ad updated successfully..",
      data: ad,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

//delete an ad
exports.deleteAd = async (req, res) => {
  try {
    const userId = req.user.id;
    const { adId } = req.params;

    let ad = await Ads.findOne({ _id: adId }).exec();

    if (!ad || ad.userId.toString() !== userId.toString()) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        status: globalConstants.status.failed,
        message: `Ad not found or you don't have permission to delete it`,
        error: globalConstants.statusCode.ForbiddenException.statusCodeName,
        statusCode: globalConstants.statusCode.ForbiddenException.code,
      });
    }

    ad = await Ads.findOneAndRemove(
      { _id: adId, userId },
      { useFindAndModify: false }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "Ad deleted successfully",
      data: ad,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

exports.getAllAdsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const ads = await Ads.find({ userId }).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All ads",
      data: ads,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: `${err.message}`,
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};
