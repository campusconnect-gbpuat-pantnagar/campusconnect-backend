const Event = require("../models/Event");
const { HttpStatusCode } = require("../enums/http-status-code.enum");
const { globalConstants } = require("../utils/constants");

exports.getEventById = async (req, res) => {
	try {
		const { eventId } = req.params;
		const event = await Event.findById(eventId).exec();
	
		if (!event) {
		  return res.status(HttpStatusCode.NOT_FOUND).json({
			status: globalConstants.status.failed,
			message: `Event not found !!`,
			error: globalConstants.statusCode.NotFoundException.statusCodeName,
			statusCode: globalConstants.statusCode.NotFoundException.code,
		  });
		}
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: `Get event by eventId: ${eventId}`,
		  data: event,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
		});
	} catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
			status: globalConstants.status.failed,
			message: "Failed to fetch event",
			error: globalConstants.statusCode.BadRequestException.statusCodeName,
			statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	}
};

// Create an Event
exports.createEvent = async (req, res) => {
	try {
		const { title, description, date, venue, media } = req.body;
	
		const newEvent = new Event({ title, description, date, venue, media });
		const event = await newEvent.save();
	
		return res.status(HttpStatusCode.CREATED).json({
		  status: globalConstants.status.success,
		  message: "Event created successfully",
		  data: event,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeCreated.code,
		});
	} catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
		  status: globalConstants.status.failed,
		  message: "Failed to create event",
		  error: globalConstants.statusCode.BadRequestException.statusCodeName,
		  statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	}
};

// Get all Events

exports.allEvents = async (req, res) => {
	try {
		const events = await Event.find({}).sort({ createdAt: -1 }).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "All events retrieved successfully",
		  data: events,
		  statusCode: globalConstants.statusCode.HttpsStatusCodeOk.code,
		});
	} catch (err) {
		console.error(err);
		return res.status(HttpStatusCode.BAD_REQUEST).json({
		  status: globalConstants.status.failed,
		  message: "Failed to retrieve events",
		  error: globalConstants.statusCode.BadRequestException.statusCodeName,
		  statusCode: globalConstants.statusCode.BadRequestException.code,
		});
	}
};

// update event
exports.updateEvent = async (req, res) => {
	try {
		const { title, description, date, venue, media } = req.body;
		const { eventId } = req.params;
		const updateObj = { title, description, date, venue, media };
	
		let event = await Event.findOne({ _id: eventId }).exec();
		if (!event._id) {
		  return res.status(HttpStatusCode.FORBIDDEN).json({
			status: globalConstants.status.failed,
			message: `Event not found`,
			error: globalConstants.statusCode.ForbiddenException.statusCodeName,
			statusCode: globalConstants.statusCode.ForbiddenException.code,
		  });
		}
	
		event = await Event.findOneAndUpdate(
		  { _id: eventId },
		  { $set: updateObj },
		  { useFindAndModify: false, new: true }
		).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "Event updated successfully..",
		  data: event,
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

// delete event
exports.deleteEvent = async (req, res) => {
	try {
		const { eventId } = req.params;
		let event = await Event.findOne({ _id: eventId }).exec();
	
		if (!event) {
		  return res.status(HttpStatusCode.FORBIDDEN).json({
			status: globalConstants.status.failed,
			message: `Event not found or you don't have permission to delete it`,
			error: globalConstants.statusCode.ForbiddenException.statusCodeName,
			statusCode: globalConstants.statusCode.ForbiddenException.code,
		  });
		}
	
		event = await Event.findOneAndRemove(
		  { _id: eventId },
		  { useFindAndModify: false }
		).exec();
	
		return res.status(HttpStatusCode.OK).json({
		  status: globalConstants.status.success,
		  message: "Event deleted successfully",
		  data: event,
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