const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ["student", "admin"], // Adjust if there are more user types
  },
  name: { type: String },
  profilePicture: { type: String },
  skills: [{ type: String }],
  education: [
    {
      type: { type: String, required: true }, // E.g., "10th", "12th", "B.Tech"
      percentage: { type: Number, required: true },
    },
  ],
  department: { type: String }, // E.g., "Computer Science", "Mechanical"
  isPlaced: { type: Boolean }, // Defaults to false (not placed)
  passoutYear: { type: Number },
});

// Compile user model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
