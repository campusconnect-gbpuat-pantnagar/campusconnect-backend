const Poll = require("../models/Poll")
const { HttpStatusCode } = require("../enums/http-status-code.enum");
const { globalConstants } = require("../utils/constants");

exports.getPollById = async (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findById(pollId).exec();

    if (!poll) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        status: globalConstants.status.failed,
        message: `Poll not found !!`,
        error: globalConstants.statusCode.NotFoundException.statusCodeName,
        statusCode: globalConstants.statusCode.NotFoundException.code,
      });
    }

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `Get poll by pollId: ${pollId}`,
      data: poll,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to fetch poll",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};


exports.createPoll = async (req, res) => {
  try {
    const { title, options } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const newPoll = new Poll({ userId, title, options });
    const poll = await newPoll.save();

    return res.status(HttpStatusCode.CREATED).json({
      status: globalConstants.status.success,
      message: "Poll created successfully",
      data: poll,
      statusCode: globalConstants.statusCode.HttpsStatusCodeCreated.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to create poll",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};


exports.voteOnPoll = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pollId, optionId } = req.params;

    let poll = await Poll.findOne({ _id: pollId }).exec();

    if (!poll) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        status: globalConstants.status.failed,
        message: `Poll not found`,
        error: globalConstants.statusCode.ForbiddenException.statusCodeName,
        statusCode: globalConstants.statusCode.ForbiddenException.code,
      });
    }

    poll = await Poll.findOneAndUpdate(
      { "_id": pollId, "options._id": optionId },
      { 
        $addToSet: { 
          "options.$.votes": userId, 
          "totalVotes": userId 
        }
      },  
      { new: true }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "Voted on poll successfully",
      data: poll,
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


exports.allPolls = async (req, res) => {
  try {
    const polls = await Poll.find({}).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All polls retrieved successfully",
      data: polls,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to retrieve polls",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

exports.deletePoll = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pollId } = req.params;

    let poll = await Poll.findOne({ _id: pollId }).exec();

    if (!poll || poll.userId.toString() !== userId.toString()) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        status: globalConstants.status.failed,
        message: `Poll not found or you don't have permission to delete it`,
        error: globalConstants.statusCode.ForbiddenException.statusCodeName,
        statusCode: globalConstants.statusCode.ForbiddenException.code,
      });
    }

    poll = await Poll.findOneAndRemove(
      { _id: pollId, userId },
      { useFindAndModify: false }
    ).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "Poll deleted successfully",
      data: poll,
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

