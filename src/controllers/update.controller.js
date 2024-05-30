const { getUserById } = require("../controllers/user.controller");
const Update = require("../models/Update");

exports.getUpdateById = (req, res, next, Id) => {
	Update.findById(Id).exec((err, update) => {
		if (err) {
			return res.status(400).json({
				errorMsg: "An error occured",
			});
		}
		if (!update) {
			return res.status(400).json({
				errorMsg: "Update not found",
			});
		}
		req.update = update;
		next();
	});
};

// Create an Update
exports.createUpdate = (req, res) => {
	const { description } = req.body;
	const newUpdate = Update({ description });
	newUpdate.save((err, update) => {
		if (err) {
			res.status(400).json({
				errorMsg: "An error occured",
			});
		}
		return res.status(200).json(update);
	});
};

// Get all Updates
exports.getUpdates = (req, res) => {
	Update.find()
		.sort({ createdAt: -1 })
		.exec((err, updates) => {
			if (err) {
				res.status(400).json({
					errorMsg: "An error occured",
				});
			}
			return res.json(updates);
		});
};

//Read a particular update
exports.getUpdate = (req, res) => {
	return res.json(req.update);
};

// delete update
exports.deleteUpdate = (req, res) => {
	Update.findByIdAndRemove(
		{ _id: req.update._id },
		{ useFindAndModify: false, new: true },
		(err, update) => {
			if (err || !update) {
				return res.status(400).json({
					error: "An error occured,  try again later",
				});
			}
			return res.status(200).json({ message: "Update has been deleted" });
		}
	);
};