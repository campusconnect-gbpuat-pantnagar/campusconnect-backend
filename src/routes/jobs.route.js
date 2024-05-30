const express = require("express");

const {
  getJobById,
  createJob,
  allJobs,
  getJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

// create job
router.post("/jobs", AuthMiddleware, createJob);

// read all jobs
router.get("/jobs", AuthMiddleware, allJobs);

//read a particular job
router.get("/jobs/:jobId", AuthMiddleware, getJob);

// update job
router.put("/jobs/:jobId", AuthMiddleware, updateJob);

// delete job
router.delete("/jobs/:jobId", AuthMiddleware, deleteJob);
module.exports = router;
