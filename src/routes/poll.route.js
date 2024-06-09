const express = require("express");
const {
  getPollById,
  createPoll,
  voteOnPoll,
  allPolls,
  deletePoll,
} = require("../controllers/poll.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/polls", AuthMiddleware, allPolls);
// This route is used for creating the polls
router.post("/polls", AuthMiddleware, createPoll);

// this route is used for making vote on option on specific poll
router.put("/polls/:pollId/:optionId/vote", AuthMiddleware, voteOnPoll);

// get all polls

// get poll by pollId
router.get("/polls/:pollId", AuthMiddleware, getPollById);

// delete the poll by pollId
router.delete("/polls/:pollId", AuthMiddleware, deletePoll);

module.exports = router;
