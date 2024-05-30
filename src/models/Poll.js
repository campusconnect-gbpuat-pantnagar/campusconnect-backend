const mongoose = require("mongoose")

const pollSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",  // this need to be deleted if it creates a problem
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  options: [
    {
      text: { type: String, required: true },
      votes: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        }
      ],
    }
  ],
  created: {
    type: Date,
    default: Date.now
  },
  totalVotes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    }
  ]
});

module.exports = mongoose.model("Poll", pollSchema);
