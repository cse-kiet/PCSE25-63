const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import Mongoose models
const Student = require('../models/student');
const Faculty = require('../models/faculty');
const Hod = require('../models/hod');
const TnP = require('../models/TnP');

require("dotenv").config();

// Default password
const defaultPassword = 'KIET123';

// MongoDB connection URL
const mongoURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.vwa2ku2.mongodb.net/TnPDatabase?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose.connect(mongoURL)
.then(async () => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// async function createBaseUsers() {
//   try {
//     const hashedPassword = await bcrypt.hash("KIET123", 10);

//     const users = [
//       new Student({
//         name: "Student",
//         email: "student@kiet.edu",
//         rollNo: "STU001",
//         userType: "student",
//         password: hashedPassword,
//         department: "CSE",
//         isPlaced: false,
//         passoutYear: 2025,
//         education: [
//           { type: "10th", percentage: 85 },
//           { type: "12th", percentage: 88 },
//         ],
//         skills: ["MongoDB", "Node.js"],
//       }),
//       new Faculty({
//         name: "Faculty",
//         email: "faculty@kiet.edu",
//         userType: "faculty",
//         password: hashedPassword,
//         department: "CSE",
//       }),
//       new Hod({
//         name: "HOD",
//         email: "hod@kiet.edu",
//         userType: "hod",
//         password: hashedPassword,
//         department: "CSE",
//       }),
//       new TnP({
//         name: "TnP",
//         email: "tnp@kiet.edu",
//         userType: "tnp",
//         password: hashedPassword,
//       }),
//     ];

//     await Promise.all(users.map((user) => user.save()));
//     console.log("✅ Dummy users created successfully!");
//   } catch (err) {
//     console.error("❌ Failed to create dummy users:", err);
//   }
// }
