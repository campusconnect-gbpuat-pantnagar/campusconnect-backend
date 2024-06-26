const mongoose = require("mongoose");
const { toJSON } = require("./plugins/toJSON");

const blogSchema = new mongoose.Schema(
  {
    objType: {
      type: String,
      default: "blog",
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
      required: true,
    },
    is_safe: {
      type: Boolean,
      default: true,
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
    link: {
      type: String,
      default: null,
    },
    upvotes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
    shareCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

blogSchema.plugin(toJSON);
module.exports = mongoose.model("Blog", blogSchema);
