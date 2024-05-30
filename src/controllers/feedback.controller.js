const Feedback = require("../models/Feedback")

exports.getFeedbackById = (req, res, next, Id) => {
  Feedback.findById(Id).exec((err, feedback) => {
    if (err) {
      return res.status(400).json({
        errorMsg: "An error occured",
      })
    }
    if (!feedback) {
      return res.status(400).json({
        errorMsg: "Feedback not found",
      })
    }
    req.feedback = feedback
    next()
  })
}

// create feedback
exports.createFeedback = (req, res) => {
  const user = req.profile
  const { feedback } = req.body
  var picture
  if (req.file) {
    picture = req.file.path
  }
  const newFeedback = Feedback({ user, feedback, picture })
  newFeedback.save((err, feedback) => {
    if (err) {
      return res.status(400).json({
        errorMsg: "An error occured",
      })
    }
    res.status(200).json(feedback)
  })
}

//get all feedbacks
exports.allFeedbacks = (req, res) => {
  Feedback.find().exec((err, feedbacks) => {
    if (err) {
      res.status(400).json({
        errorMsg: "An error occured",
      })
    }

    return res.json(feedbacks)
  })
}

//Read a particular feedback
exports.getFeedback = (req, res) => {
  Feedback.find({ _id: req.feedback._id }).exec((err, feedback) => {
    if (err) {
      res.status(400).json({
        errorMsg: "An error occured",
      })
    }
    return res.json(feedback)
  })
}
