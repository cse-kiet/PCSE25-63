const JobNotification = require("../models/jobNotification");

exports.getHomePage = (req, res) => {
  res.render("home", { loggedIn: req.session.userId ? true : false });
};

exports.getDepartmentPage = (req, res) => {
  res.render("department");
};

exports.getRecruiterPage = (req, res) => {
  res.render("recruiter");
};

exports.getPlacementPage = (req, res) => {
  res.render("placement");
};

exports.getNotifyPage = (req, res) => {
  res.render("notify");
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

// Delete expired notifications every day
const deleteExpiredNotifications = async () => {
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

setInterval(deleteExpiredNotifications, 24 * 60 * 60 * 1000);
