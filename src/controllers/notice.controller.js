const Notice = require("../models/Notice");

exports.getNoticeById = async (req, res) => {
	try {
		const { noticeId } = req.params;
		const notice = await Notice.findById(noticeId).exec();
	
		if (!notice) {
		  return res.status(HttpStatusCode.NOT_FOUND).json({
			status: globalConstants.status.failed,
			message: `Notice not found !!`,
			error: globalConstants.statusCode.NotFoundException.statusCodeName,
			statusCode: globalConstants.statusCode.NotFoundException.code,
		  });
		}
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: `Get notice by noticeId: ${noticeId}`,
		  data: notice,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
		});
	} catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
		  status: globalConstants.status.failed,
		  message: "Failed to fetch notice",
		  error: globalConstants.statusCode.BadRequestException.statusCodeName,
		  statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	}
};

// Create notice
exports.createNotice = async (req, res) => {
	try {
		const { title, description, link } = req.body;
		
		const newNotice = new Notice({ title, description, link });
		const notice = await newNotice.save();
	
		return res.status(HttpStatusCode.CREATED).json({
		  status: globalConstants.status.success,
		  message: "Notice created successfully",
		  data: notice,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeCreated.code,
		});
	  } catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
		  status: globalConstants.status.failed,
		  message: "Failed to create notice",
		  error: globalConstants.statusCode.BadRequestException.statusCodeName,
		  statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	  }
};

// Read all notices
exports.allNotices = async (req, res) => {
	try {
		const notices = await Notice.find({}).sort({ createdAt: -1 }).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "All notices retrieved successfully",
		  data: notices,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
		});
	} catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
		  status: globalConstants.status.failed,
		  message: "Failed to retrieve notices",
		  error: globalConstants.statusCode.BadRequestException.statusCodeName,
		  statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	}
};

// Update notices
exports.updateNotice = async (req, res) => {
	try {
		const { title, description, link } = req.body;
		const { noticeId } = req.params;
		const updateObj = { title, description, link };
	
		let notice = await Notice.findOne({ _id: noticeId }).exec();
		if (!notice._id) {
		  return res.status(HttpStatusCode.FORBIDDEN).json({
			status: globalConstants.status.failed,
			message: `Notice not found`,
			error: globalConstants.statusCode.ForbiddenException.statusCodeName,
			statusCode: globalConstants.statusCode.ForbiddenException.code,
		  });
		}
	
		notice = await Notice.findOneAndUpdate(
		  { _id: noticeId },
		  { $set: updateObj },
		  { useFindAndModify: false, new: true }
		).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "Notice updated successfully..",
		  data: notice,
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

// Delete notices
exports.deleteNotice = async (req, res) => {
	try {
		const { noticeId } = req.params;
		let notice = await Notice.findOne({ _id: noticeId }).exec();
	
		if (!notice) {
		  return res.status(HttpStatusCode.FORBIDDEN).json({
			status: globalConstants.status.failed,
			message: `Notice not found or you don't have permission to delete it`,
			error: globalConstants.statusCode.ForbiddenException.statusCodeName,
			statusCode: globalConstants.statusCode.ForbiddenException.code,
		  });
		}
	
		notice = await Notice.findOneAndRemove(
		  { _id: noticeId },
		  { useFindAndModify: false }
		).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "Notice deleted successfully",
		  data: notice,
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
