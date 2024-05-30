const express = require("express");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/auth.controller");
const {
  getEventById,
  createEvent,
  allEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const { getUserById } = require("../controllers/user.controller");
const router = express.Router();

// param
router.param("userId", getUserById);
router.param("eventId", getEventById);

// create event
router.post("/create/event", isSignedIn, isAuthenticated, isAdmin, createEvent);

// all events
router.get("/events", isSignedIn, allEvents);

//get a particular event
router.get("/events/:eventId", isSignedIn, getEvent);

// update event
router.put(
  "/update/event/:userId/:eventId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateEvent
);

// delete event
router.delete(
  "/delete/event/:userId/:eventId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteEvent
);

module.exports = router;
