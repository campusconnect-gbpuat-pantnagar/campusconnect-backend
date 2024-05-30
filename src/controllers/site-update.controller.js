const Update = require("../models/site-update");

exports.getUpdateById = async (req, res) => {
	try {
		const { siteUpdateId } = req.params;
		const siteUpdate = await Update.findById(siteUpdateId).exec();
	
		if (!siteUpdate) {
		  return res.status(HttpStatusCode.NOT_FOUND).json({
			status: globalConstants.status.failed,
			message: `Site update not found !!`,
			error: globalConstants.statusCode.NotFoundException.statusCodeName,
			statusCode: globalConstants.statusCode.NotFoundException.code,
		  });
		}
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: `Get site update by siteUpdateId: ${siteUpdateId}`,
		  data: siteUpdate,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
		});
	} catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
		  status: globalConstants.status.failed,
		  message: "Failed to fetch site update",
		  error: globalConstants.statusCode.BadRequestException.statusCodeName,
		  statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	}
};

// Create an Update
exports.createUpdate = async (req, res) => {
	try {
		const { description } = req.body;
		
		const newSiteUpdate = new Update({ description });
		const siteUpdate = await newSiteUpdate.save();
	
		return res.status(HttpStatusCode.CREATED).json({
		  status: globalConstants.status.success,
		  message: "Site update created successfully",
		  data: siteUpdate,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeCreated.code,
		});
	  } catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
		  status: globalConstants.status.failed,
		  message: "Failed to create site update",
		  error: globalConstants.statusCode.BadRequestException.statusCodeName,
		  statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	  }
};

// Get all Updates
exports.getUpdates = async (req, res) => {
	try {
		const siteUpdates = await Update.find({}).sort({ createdAt: -1 }).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "All site updates retrieved successfully",
		  data: siteUpdates,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
		});
	} catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
		  status: globalConstants.status.failed,
		  message: "Failed to retrieve site updates",
		  error: globalConstants.statusCode.BadRequestException.statusCodeName,
		  statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	}
};

// delete update
exports.deleteUpdate = async (req, res) => {
	try {
		const { siteUpdateId } = req.params;
		let siteUpdate = await Update.findOne({ _id: siteUpdateId }).exec();
	
		if (!siteUpdate) {
		  return res.status(HttpStatusCode.FORBIDDEN).json({
			status: globalConstants.status.failed,
			message: `Site update not found or you don't have permission to delete it`,
			error: globalConstants.statusCode.ForbiddenException.statusCodeName,
			statusCode: globalConstants.statusCode.ForbiddenException.code,
		  });
		}
	
		siteUpdate = await Update.findOneAndRemove(
		  { _id: siteUpdateId },
		  { useFindAndModify: false }
		).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "Site update deleted successfully",
		  data: siteUpdate,
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