const mongoose = require("mongoose");
require("mongoose-type-url");

const JobSchema = new mongoose.Schema(
  {
    workTitle: {
      type: String,
      required: true,
      trim: true,
      max: 50,
    },

    company: {
      type: String,
      required: true
    },

    eligibility: {
      type: String,
      required: true
    },

    skillsReq: [
      {
        type: String,
        required: true,
      },
    ],

    workLocation: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
    },

    applyBy: {
      type: String,
      required: true,
    },

    link: {
      type: mongoose.SchemaTypes.Url,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Job", JobSchema)
