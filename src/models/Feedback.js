const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",   // this need to be deleted if it creates a problem
      required: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
      max: 3000,
    },
    media: [
			{
				url: {
					type: String,
					default: null
				},
				format: {
					type: String,
					default: null
				},
				publicId: {
					type: String,
					default: null
				},
				resource_type: {
					type: String,
					default: null
				},
				thumbnail_url: {
					type: String,
					default: null
				},
				asset_id: {
					type: String,
					default: null
				},
			}
		],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
