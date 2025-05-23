const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.getLoginPage);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/reset", authController.getResetPage);
router.post("/reset", authController.resetPassword);

module.exports = router;
