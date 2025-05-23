const JobPosting = require("../models/jobPosting");

exports.getTnPDashboard = (req, res) => {
  res.render("TnP", { successMessage: req.session.successMessage });
  req.session.successMessage = null;
};

exports.postJob = async (req, res) => {
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
