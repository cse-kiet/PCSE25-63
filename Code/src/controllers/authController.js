const bcrypt = require("bcrypt");
const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Hod = require("../models/hod");
const TnP = require("../models/tnp");

exports.getLoginPage = (req, res) => {
  res.render("login", { redirectToLogin: req.query.redirect === "true" });
};

exports.login = async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    let user;
    let userModel;

    switch (userType) {
      case "student":
        userModel = Student;
        break;
      case "tnp":
        userModel = TnP;
        break;
      case "recruiter":
        userModel = require("../models/recruiter");
        break;
      case "faculty":
        userModel = Faculty;
        break;
      case "hod":
        userModel = Hod;
        break;
      default:
        return res.send("Invalid user type");
    }

    user = await userModel.findOne({ email });
    if (!user) return res.send("Email not found");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.send("Incorrect password");

    req.session.userId = user._id;
    req.session.userType = userType;

    switch (userType) {
      case "student":
        res.redirect("/student");
        break;
      case "tnp":
        res.redirect("/tnp");
        break;
      case "recruiter":
        res.redirect("/recruiter");
        break;
      case "faculty":
      case "hod":
        res.redirect("/department");
        break;
      default:
        res.redirect("/");
        break;
    }
  } catch (error) {
    console.error(error);
    res.send("Error logging in");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.send("Error logging out");
    }
    res.redirect("/");
  });
};

exports.getResetPage = (req, res) => {
  res.render("reset");
};

exports.resetPassword = async (req, res) => {
  const { email, oldPassword, newPassword, userType } = req.body;
  try {
    let userDetails;
    switch (userType) {
      case "student":
        userDetails = await Student.findOne({ email });
        break;
      case "faculty":
        userDetails = await Faculty.findOne({ email });
        break;
      case "hod":
        userDetails = await Hod.findOne({ email });
        break;
      case "tnp":
        userDetails = await TnP.findOne({ email });
        break;
      default:
        return res.send("Invalid user type");
    }

    if (!userDetails) return res.send("User details not found");

    const passwordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!passwordMatch) return res.send("Incorrect old password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userDetails.password = hashedPassword;
    await userDetails.save();

    res.render("login");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.send("Error resetting password");
  }
};
