const Event = require("../models/Event");

exports.getEventById = (req, res, next, Id) => {
	Event.findById(Id).exec((err, event) => {
		if (err) {
			return res.status(400).json({
				errorMsg: "An error occured",
			});
		}
		if (!event) {
			return res.status(400).json({
				errorMsg: "Event not found",
			});
		}
		req.event = event;
		next();
	});
};

// Create an Event
exports.createEvent = (req, res) => {
	const { title, description, date, venue } = req.body;
	const files = req.files
	const picture = []
	for (let i = 0; i < files.length; i++) {
		picture[i] = files[i].path
	}
	const newEvent = Event({ title, description, date, venue, picture });
	newEvent.save((err, event) => {
		if (err) {
			res.status(400).json({
				errorMsg: "An error occured",
			});
		}
		return res.status(200).json(event);
	});
};

// Get all Events

exports.allEvents = (req, res) => {
	Event.find()
		.sort({ createdAt: -1 })
		.exec((err, events) => {
			if (err) {
				res.status(400).json({
					errorMsg: "An error occured",
				});
			}
			return res.json(events);
		});
};

//Read a particular event
exports.getEvent = (req, res) => {
	return res.json(req.event);
};

// update event
exports.updateEvent = (req, res) => {

	const { title, description, date, venue } = req.body;
	const files = req.files
	const picture = []
	for (let i = 0; i < files.length; i++) {
		picture[i] = files[i].path
	}

	const updateObj = { title, description, date, venue, picture };

	Event.findByIdAndUpdate(
		{ _id: req.event._id },
		{ $set: updateObj },
		{ useFindAndModify: false, new: true },
		(err, event) => {
			if (err || !event) {
				return res.status(400).json({
					error: "An error occured,  try again later",
				});
			}
			return res.status(200).json(event);
		}
	);
};

// delete event
exports.deleteEvent = (req, res) => {
	Event.findByIdAndRemove(
		{ _id: req.event._id },
		{ useFindAndModify: false, new: true },
		(err, event) => {
			if (err || !event) {
				return res.status(400).json({
					error: "An error occured,  try again later",
				});
			}
			return res.status(200).json({ message: "Event has been deleted" });
		}
	);
};