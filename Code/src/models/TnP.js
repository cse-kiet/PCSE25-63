const mongoose = require('mongoose');

const tnpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    name: { type: String }
});

const TnP = mongoose.model('TnP', tnpSchema);

module.exports = TnP;
