const express = require("express");
const router = express.Router();
const generalController = require("../controllers/generalController");
const {
  requireAuth,
  restrictToUserType,
} = require("../middleware/authMiddleware"); // Add this line

router.get("/", generalController.getHomePage);
router.get(
  "/department",
  requireAuth,
  restrictToUserType(["faculty", "hod"]),
  generalController.getDepartmentPage
);
router.get(
  "/recruiter",
  requireAuth,
  restrictToUserType(["recruiter"]),
  generalController.getRecruiterPage
);
router.get("/placement", generalController.getPlacementPage);
router.get("/notify", generalController.getNotifyPage);
router.post("/submit-notification", generalController.submitNotification);

module.exports = router;
