const JobNotification = require('../models/jobNotification');

const deleteExpiredNotifications = async () => {
    try {
        const currentDate = new Date();
        // Find notifications with expectedDate less than current date
        const expiredNotifications = await JobNotification.find({ expectedDate: { $lt: currentDate } });

        // Delete expired notifications
        for (const notification of expiredNotifications) {
            await JobNotification.findByIdAndDelete(notification._id);
            console.log(`Deleted notification: ${notification.title}`);
        }
    } catch (error) {
        console.error("Error deleting expired notifications:", error);
    }
};

module.exports = deleteExpiredNotifications;
