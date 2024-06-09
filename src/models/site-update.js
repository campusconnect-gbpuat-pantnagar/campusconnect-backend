const mongoose = require("mongoose");
const { toJSON } = require("./plugins/toJSON");
require("mongoose-type-url");

const siteUpdateSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

siteUpdateSchema.plugin(toJSON);
module.exports = mongoose.model("Update", siteUpdateSchema);
