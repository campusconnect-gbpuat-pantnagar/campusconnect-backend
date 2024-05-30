const Job = require("../models/Jobs");
const path = require("path");

exports.getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).exec();

    if (!job) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        status: globalConstants.status.failed,
        message: `Job not found !!`,
        error: globalConstants.statusCode.NotFoundException.statusCodeName,
        statusCode: globalConstants.statusCode.NotFoundException.code,
      });
    }

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: `Get job by jobId: ${jobId}`,
      data: job,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to fetch job",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// Create job
exports.createJob = async (req, res) => {
  try {
    const { workTitle, company, batchYear, collegeId, eligibility, skillsReq, workLocation, salary, applyBy, link } = req.body;

    const newJob = new Job({ workTitle, company, batchYear, collegeId, eligibility, skillsReq, workLocation, salary, applyBy, link });
    const job = await newJob.save();

    return res.status(HttpStatusCode.CREATED).json({
      status: globalConstants.status.success,
      message: "Job created successfully",
      data: job,
      statusCode: globalConstants.statusCode.HttpsStatusCodeCreated.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to create job",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// read all jobs
exports.allJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 }).exec();

    return res.status(HttpStatusCode.OK).json({
      status: globalConstants.status.success,
      message: "All jobs retrieved successfully",
      data: jobs,
      statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
    });
  } catch (err) {
    console.error(err);
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: globalConstants.status.failed,
      message: "Failed to retrieve jobs",
      error: globalConstants.statusCode.BadRequestException.statusCodeName,
      statusCode: globalConstants.statusCode.BadRequestException.code,
    });
  }
};

// update job
exports.updateJob = async (req, res) => {
  try {
		const { workTitle, company, batchYear, collegeId, eligibility, skillsReq, workLocation, salary, applyBy, link } = req.body;
		const { jobId } = req.params;
		const updateObj = { workTitle, company, batchYear, collegeId, eligibility, skillsReq, workLocation, salary, applyBy, link };
	
		let job = await Job.findOne({ _id: jobId }).exec();
		if (!job._id) {
		  return res.status(HttpStatusCode.FORBIDDEN).json({
			status: globalConstants.status.failed,
			message: `Job not found`,
			error: globalConstants.statusCode.ForbiddenException.statusCodeName,
			statusCode: globalConstants.statusCode.ForbiddenException.code,
		  });
		}
	
		job = await Job.findOneAndUpdate(
		  { _id: jobId },
		  { $set: updateObj },
		  { useFindAndModify: false, new: true }
		).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "Job updated successfully..",
		  data: job,
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

// delete job
exports.deleteJob = async (req, res) => {
  try {
		const { jobId } = req.params;
		let job = await Job.findOne({ _id: jobId }).exec();
	
		if (!job) {
		  return res.status(HttpStatusCode.FORBIDDEN).json({
			status: globalConstants.status.failed,
			message: `Job not found or you don't have permission to delete it`,
			error: globalConstants.statusCode.ForbiddenException.statusCodeName,
			statusCode: globalConstants.statusCode.ForbiddenException.code,
		  });
		}
	
		job = await Job.findOneAndRemove(
		  { _id: jobId },
		  { useFindAndModify: false }
		).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "Job deleted successfully",
		  data: job,
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
