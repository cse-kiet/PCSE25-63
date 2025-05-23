const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const dbConnection = require("./src/db/conn");

// Load environment variables from .env file
dotenv.config();

// Import routes
const studentRoutes = require("./src/routes/studentRoutes");
const authRoutes = require("./src/routes/authRoutes");
const generalRoutes = require("./src/routes/generalRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const tnpRoutes = require("./src/routes/tnpRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");

// Initialize app
const app = express();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-default-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Set view engine
app.set("views", path.join(__dirname, "/templates/views"));
app.set("view engine", "ejs");

// Use routes
app.use("/student", studentRoutes);
app.use("/", generalRoutes);
app.use("/", authRoutes);
app.use("/", jobRoutes);
app.use("/tnp", tnpRoutes);
app.use("/department", departmentRoutes);

// Error handling middleware
// app.use(require("./src/middlewares/errorHandler"));

const deleteExpiredNotifications = require("./src/utils/deleteExpiredNotifications");
setInterval(deleteExpiredNotifications, 24 * 60 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
