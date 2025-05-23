const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobNotificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    expectedDate: {
        type: Date,
        required: true
    }
});

const JobNotification = mongoose.model('JobNotification', jobNotificationSchema);

module.exports = JobNotification;
