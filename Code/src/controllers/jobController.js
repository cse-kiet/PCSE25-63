// src/controllers/jobController.js

const JobPosting = require("../models/jobPosting");
const JobNotification = require("../models/jobNotification");

exports.addJobPosting = async (req, res) => {
  try {
    const {
      companyName,
      profile,
      skillsRequired,
      eligibility,
      description,
      applyLink,
    } = req.body;
    const jobPosting = new JobPosting({
      companyName,
      profile,
      skillsRequired: skillsRequired.split(",").map((skill) => skill.trim()),
      eligibility,
      description,
      applyLink,
    });
    await jobPosting.save();
    res.render("TnP", { successMessage: "Job posted successfully" });
  } catch (error) {
    console.error(error);
    res.send("Error adding job posting");
  }
};

exports.submitNotification = async (req, res) => {
  try {
    const newNotification = new JobNotification({
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      expectedDate: req.body.expectedDate,
    });
    await newNotification.save();
    res.status(200).send("Notification submitted successfully!");
  } catch (error) {
    console.error("Error submitting notification:", error);
    res.status(500).send("Internal server error");
  }
};

exports.deleteExpiredNotifications = async () => {
  try {
    const currentDate = new Date();
    const expiredNotifications = await JobNotification.find({
      expectedDate: { $lt: currentDate },
    });
    for (const notification of expiredNotifications) {
      await JobNotification.findByIdAndDelete(notification._id);
      console.log(`Deleted notification: ${notification.title}`);
    }
  } catch (error) {
    console.error("Error deleting expired notifications:", error);
  }
};
