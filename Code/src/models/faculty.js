const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    name: { type: String },
    department: { type: String }, // E.g., "Computer Science", "Mechanical"
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
