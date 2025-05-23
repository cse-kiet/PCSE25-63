// src/controllers/studentController.js
const JobPosting = require("../models/jobPosting");
const User = require("../models/student");
const uploadOnCloudinary = require("../utils/cloudinary");

exports.getUpdateProfilePage = (req, res) => {
  res.render("updateProfile");
};

exports.getStudentPage = async (req, res) => {
   try {
        // Fetch job postings from the database
        const jobPostings = await JobPosting.find();

        // Fetch user data from the database based on the logged-in user ID
        const user = await User.findById(req.session.userId);
        // console.log(user.profilePicture);
        // Pass the user data and job postings to the student.ejs view
        res.render('student', { user, jobPostings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
};

exports.getAddEducationPage = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const education = user ? user.education : [];
    res.render("AddEducation", { education });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching Educational details");
  }
};

exports.getSkillsPage = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const skills = user ? user.skills : [];
    res.render("skills", { skills });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching skills");
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.session.userId;
  const { name } = req.body;
  const profilePicture = req.file;

  try {
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (profilePicture) {
      const cloudinaryResponse = await uploadOnCloudinary(profilePicture.path);
      if (cloudinaryResponse) updatedFields.profilePicture = cloudinaryResponse;
      else throw new Error("Error uploading profile picture to Cloudinary");
    }
    await User.findByIdAndUpdate(userId, updatedFields);
    res.redirect("/student");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.addSkills = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).send("User not authenticated");
    const { skill } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { skills: skill } });
    res.redirect("/skills");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding skill");
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).send("User not authenticated");
    const { tenthPercentage, twelfthPercentage, btechPercentage } = req.body;
    const education = [
      { type: "10th", percentage: parseFloat(tenthPercentage) },
      { type: "12th", percentage: parseFloat(twelfthPercentage) },
      { type: "B.Tech", percentage: parseFloat(btechPercentage) },
    ];
    await User.findByIdAndUpdate(userId, { education: education });
    res.redirect("/AddEducation");
  } catch (error) {
    console.error(error);
    res.send("Error adding education details");
  }
};
