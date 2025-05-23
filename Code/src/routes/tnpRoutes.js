const express = require("express");
const router = express.Router();
const {
  requireAuth,
  restrictToUserType,
} = require("../middleware/authMiddleware");
const tnpController = require("../controllers/tnpController");

router.get(
  "/",
  requireAuth,
  restrictToUserType(["tnp"]),
  tnpController.getTnPDashboard
);
router.post(
  "/job_postings",
  requireAuth,
  restrictToUserType(["tnp"]),
  tnpController.postJob
);

module.exports = router;
