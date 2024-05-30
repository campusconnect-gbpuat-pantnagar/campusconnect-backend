const express = require("express");

const {
  getJobById,
  createJob,
  allJobs,
  getJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs.controller");
const { AuthMiddleware, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

// public routes

// read all jobs
router.get("/jobs", AuthMiddleware, allJobs);
//read a particular job
router.get("/jobs/:jobId", AuthMiddleware, getJob);

// admin routes

// create job
router.post("/jobs", AuthMiddleware, isAdmin, createJob);
// update job
router.put("/jobs/:jobId", AuthMiddleware, isAdmin, updateJob);

// delete job
router.delete("/jobs/:jobId", AuthMiddleware, isAdmin, deleteJob);
module.exports = router;
