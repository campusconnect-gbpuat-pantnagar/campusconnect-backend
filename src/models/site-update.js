const mongoose = require("mongoose");
require("mongoose-type-url");

const siteUpdateSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Update", siteUpdateSchema);
