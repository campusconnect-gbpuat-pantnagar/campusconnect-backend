const mongoose = require("mongoose");
const { toJSON } = require("./plugins/toJSON");

const adsSchema = new mongoose.Schema(
  {
    objType: {
      type: String,
      default: "ads",
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // this need to be deleted if it creates a problem
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      max: 50,
    },
    content: {
      type: String,
      max: 3000,
    },
    is_safe: {
      type: Boolean,
      default: true,
    },
    contact: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    media: [
      {
        url: {
          type: String,
          default: null,
        },
        format: {
          type: String,
          default: null,
        },
        publicId: {
          type: String,
          default: null,
        },
        resource_type: {
          type: String,
          default: null,
        },
        thumbnail_url: {
          type: String,
          default: null,
        },
        asset_id: {
          type: String,
          default: null,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
adsSchema.plugin(toJSON);
module.exports = mongoose.model("Ads", adsSchema);
