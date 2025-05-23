// src/routes/jobRoutes.js

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const {
  requireAuth,
  restrictToUserType,
} = require("../middleware/authMiddleware");

router.post(
  "/job_postings",
  requireAuth,
  restrictToUserType(["tnp"]),
  jobController.addJobPosting
);
router.post("/submit-notification", jobController.submitNotification);

module.exports = router;
