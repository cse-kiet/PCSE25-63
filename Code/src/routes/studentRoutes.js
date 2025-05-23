// src/routes/studentRoutes.js
const path = require("path");
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const {
  requireAuth,
  restrictToUserType,
} = require("../middleware/authMiddleware");

router.get(
  "/",
  requireAuth,
  restrictToUserType(["student"]),
  studentController.getStudentPage
);
router.get(
  "/updateProfile",
  requireAuth,
  restrictToUserType(["student"]),
  studentController.getUpdateProfilePage
);

router.get(
  "/AddEducation",
  requireAuth,
  restrictToUserType(["student"]),
  studentController.getAddEducationPage
);

router.get(
  "/skills",
  requireAuth,
  restrictToUserType(["student"]),
  studentController.getSkillsPage
);

router.post(
  "/update_profile",
  requireAuth,
  restrictToUserType(["student"]),
  studentController.updateProfile
);

router.post(
  "/addSkills",
  requireAuth,
  restrictToUserType(["student"]),
  studentController.addSkills
);

router.post(
  "/updateEducation",
  requireAuth,
  restrictToUserType(["student"]),
  studentController.updateEducation
);

module.exports = router;
