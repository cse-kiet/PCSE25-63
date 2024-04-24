const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    profile: {
        type: String
    },
    skillsRequired: {
        type: [String]
    },
    eligibility: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    applyLink: {
        type: String,
        required: true
    }
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;
