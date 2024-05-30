const express = require("express");

const {
  getEventById,
  createEvent,
  allEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const { AuthMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

// all events
router.get("/events", AuthMiddleware, allEvents);

//get a particular event
router.get("/events/:eventId", AuthMiddleware, getEventById);

// admin routes

// create event
router.post("/events", AuthMiddleware, isAdmin, createEvent);
// update event
router.put("/events/:eventId", AuthMiddleware, isAdmin, updateEvent);

// delete event
router.delete("/events/:eventId", AuthMiddleware, isAdmin, deleteEvent);

module.exports = router;
