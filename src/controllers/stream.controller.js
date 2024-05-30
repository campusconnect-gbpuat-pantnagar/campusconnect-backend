const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getUserById } = require("./user.controller");
const Stream = require("../models/Stream");

exports.getStreamById = (req, res, next, Id) => {
	Stream.findById(Id).exec((err, stream) => {
		if (err) {
			return res.status(400).json({
				errorMsg: "An error occured",
			});
		}
		if (!stream) {
			return res.status(400).json({
				errorMsg: "Live Stream not found",
			});
		}
		req.stream = stream;
		next();
	});
};

fs.mkdir("uploads", (err) => {
	if (err) {
	}
	fs.mkdir("uploads/streams", (err) => {
		if (err) {
		}
	});
});

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/streams");
	},
	filename: (req, file, cb) => {
		cb(
		  null,
		  "stream_" +
		  new Date(Date.now())
			.toISOString()
			.replace(/-|:|Z|\./g, "")
			.replace(/T/g, "_") +
		  path.extname(file.originalname)
		)
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype == "image/jpeg" ||
		file.mimetype == "image/png" ||
		file.mimetype == "image/gif" ||
		file.mimetype == "image/svg+xml" ||
		file.mimetype == "video/mp4"
	) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

exports.upload = multer({ storage: storage, fileFilter: fileFilter })

// Create an Stream
exports.createStream = (req, res) => {
	const { title, organizer, date, time, type, attendees } = req.body;
	const files = req.files
	console.log("files: ", files)
	const picture = []
	for (let i = 0; i < files.length; i++) {
		picture[i] = files[i].path
	}
	const newStream = Stream({ title, organizer, date, time, picture, type, attendees });
	newStream.save((err, stream) => {
		if (err) {
			res.status(400).json({
				errorMsg: "An error occured",
			});
		}
		return res.status(200).json(stream);
	});
};

// Get all Streams

exports.allStreams = (req, res) => {
	Stream.find()
		.sort({ createdAt: -1 })
		.exec((err, streams) => {
			if (err) {
				res.status(400).json({
					errorMsg: "An error occured",
				});
			}
			return res.json(streams);
		});
};

//Read a particular stream
exports.getStream = (req, res) => {
	return res.json(req.stream);
};

// update stream
exports.updateStream = (req, res) => {
	Stream.findById({ _id: req.stream._id }).exec((err, stream) => {
		for (let picture of stream.picture) {
		  let path = picture
	
		  fs.readdir(path, (err, files) => {
			if (path) {
			  fs.unlink(path, (err) => {
				if (err) {
				  console.error(err)
				  return
				}
			  })
			}
		  })
		}
	})
	const { title, organizer, date, time, type, attendees } = req.body;
	const files = req.files
	const picture = []
	for (let i = 0; i < files.length; i++) {
		picture[i] = files[i].path
	}
	const updateObj = { title, organizer, date, time, picture, type, attendees };

	Stream.findByIdAndUpdate(
		{ _id: req.stream._id },
		{ $set: updateObj },
		{ useFindAndModify: false, new: true },
		(err, stream) => {
			if (err || !stream) {
				return res.status(400).json({
					error: "An error occured,  try again later",
				});
			}
			return res.status(200).json(stream);
		}
	);
};

// delete stream
exports.deleteStream = (req, res) => {
	Stream.findByIdAndRemove(
		{ _id: req.stream._id },
		{ useFindAndModify: false, new: true },
		(err, stream) => {
			if (err || !stream) {
				return res.status(400).json({
					error: "An error occured,  try again later",
				});
			}
			return res.status(200).json({ message: "Live Stream has been deleted" });
		}
	);
};