const mongoose = require("mongoose");
const { toJSON } = require("./plugins/toJSON");
require("mongoose-type-url");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    link: {
      type: mongoose.SchemaTypes.Url,
      required: true,
    },
  },
  { timestamps: true }
);
noticeSchema.plugin(toJSON);
module.exports = mongoose.model("Notice", noticeSchema);
