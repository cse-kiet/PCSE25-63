const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Define sample user data
// const usersData = [
//     {
//       userType: "student",
//       email: "student@example.com",
//       password: "KIET12345"
//     },
//     {
//       userType: "faculty",
//       email: "faculty@example.com",
//       password: "KIET123"
//     },
//     {
//       userType: "tnp",
//       email: "tnp@example.com",
//       password: "KIET123"
//     },
//     {
//       userType: "hod",
//       email: "hod@example.com",
//       password: "KIET123"
//     },
//     {
//       userType: "recruiter",
//       email: "recruiter@example.com",
//       password: "Recruiter123"
//     }
// ];

// Hash passwords before inserting into the database
// const hashPasswords = async () => {
//     try {
//         for (let user of usersData) {
//             const hashedPassword = await bcrypt.hash(user.password, 10);
//             user.password = hashedPassword;
//         }
//     } catch (error) {
//         console.error('Error hashing passwords:', error);
//     }
// };

// MongoDB connection URL
const mongoURL = 'mongodb://127.0.0.1:27017/TnPDatabase';

// Connect to MongoDB
mongoose.connect(mongoURL)
.then(async () => {
    console.log('Connected to MongoDB');
    // Hash passwords
    // await hashPasswords();
    // Insert sample user data into MongoDB
    // User.insertMany(usersData)
    // .then(() => {
    //     console.log('Sample user data inserted successfully');
    // })
    // .catch((error) => {
    //     console.error('Error inserting sample user data:', error);
    // });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
