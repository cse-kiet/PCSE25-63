const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    name: { type: String }, // Add name field
    profilePicture: { type: String } // Add profilePicture field to store the path or URL of the profile picture
});
// Compile user model
const User = mongoose.model('User', userSchema);

module.exports = User;



