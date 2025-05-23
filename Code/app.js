const express = require('express');
const dbConnection = require('./src/db/conn');
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const JobPosting = require('./src/models/jobPosting');
const Notification = require('./src/models/jobNotification')
const User = require('./src/models/student');
const uploadOnCloudinary=require('./src/utils/cloudinary')


// Import Mongoose models
const Student = require('./src/models/student');
const Faculty = require('./src/models/faculty');
const Hod = require('./src/models/hod');
const TnP = require('./src/models/TnP');
const JobNotification = require('./src/models/jobNotification')



const PORT = process.env.PORT || 3000;
const app = express();
require('dotenv').config();

//public folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('views', path.join(__dirname, '/templates/views'));
app.set('view engine', 'ejs');

// Middleware for session management
app.use(session({
    secret: 'harekrishnaharekrishnakrishnakrishnahareharehareramharereamramramharehare', // Change this to a strong secret
    resave: false,
    saveUninitialized: true
}));

// authorization
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
      // User is authenticated, allow access to the next middleware or route handler
      next();
  } else {
      // User is not authenticated, redirect to login page
      res.redirect('/login');
  }
};

const restrictToUserType = (allowedUserTypes) => {
    return (req, res, next) => {
        const userType = req.session.userType;
        if (allowedUserTypes.includes(userType)) {
            // User is allowed to access this module, proceed to the next middleware or route handler
            next();
        } else {
            // User is not allowed to access this module, redirect to appropriate page or send 403 Forbidden status
            res.status(403).send(`You can't access this module because you're logged as a ${userType}`);
        }
    };
};

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use original file name for uploaded file
    }
});

// Initialize Multer upload
const upload = multer({ 
    storage: storage, 
});


// Home route
app.get('/', (req, res) => {
    res.render('home', { loggedIn: req.session.userId ? true : false });
});

// student route
app.get('/student', requireAuth, restrictToUserType(['student']), async (req, res) => {
    try {
        // Fetch job postings from the database
        const jobPostings = await JobPosting.find();

         const notification = await Notification.find();

        // Fetch user data from the database based on the logged-in user ID
        const user = await User.findById(req.session.userId);
        // console.log(user.profilePicture);
        // Pass the user data and job postings to the student.ejs view
        res.render("student", { user, jobPostings, notification });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});



// TnP route
app.get('/TnP', requireAuth, restrictToUserType(['tnp']), (req, res) => {
    res.render('TnP', { successMessage: req.session.successMessage });
    // Clear the session after using the success message
    req.session.successMessage = null;
});

// Department route
app.get(
  "/department",
  requireAuth,
  restrictToUserType(["faculty", "hod"]),
  async (req, res) => {
    try {
      // Get the logged in faculty's details
      const facultyId = req.session.userId;
      const faculty = await Faculty.findById(facultyId);

      // Get the selected year from query params, default to current year
      const selectedYear = req.query.year || new Date().getFullYear();
      // Fetch students based on faculty's department and selected year
      const students = await Student.find({
        department: faculty.department,
        passoutYear: selectedYear,
      }).select("name email rollNo passoutYear isPlaced"); // Select the fields you want to display
      // Calculate statistics
      const totalStudents = students.length;
      const placedStudents = students.filter(
        (student) => student.isPlaced
      ).length; // Assuming you have an isPlaced field
      const pendingStudents = totalStudents - placedStudents;

      res.render("department", {
        faculty,
        students,
        selectedYear,
         statistics: {
                totalStudents,
                placedStudents,
                pendingStudents
            },
        currentYear: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("Error fetching department data:", error);
      res.status(500).send("Error fetching department data");
    }
  }
);

// Recruiter route
app.get('/recruiter', requireAuth, restrictToUserType(['recruiter']), (req, res) => {
    res.render('recruiter');
});

// Reset password route (GET request)
app.get('/reset', (req, res) => {
    res.render('reset');
});

// Login page route
app.get('/login', (req, res) => {
  const redirectToLogin = req.query.redirect === 'true';
  res.render('login', { redirectToLogin });
});

// Reset password route (POST request)
app.post('/reset', async (req, res) => {
    const { email, oldPassword, newPassword, userType } = req.body;
    try {
        // Verify the user's userType
        const userType = req.body.userType;
        console.log(userType);
        // Find user details based on user type
        let userDetails;
        switch (userType) {
            case 'student':
                userDetails = await Student.findOne({ email });
                break;
            case 'faculty':
                userDetails = await Faculty.findOne({ email });
                break;
            case 'hod':
                userDetails = await Hod.findOne({ email });
                break;
            case 'tnp':
                userDetails = await TnP.findOne({ email });
                break;
            default:
                return res.send('Invalid user type');
        }

        if (!userDetails) {
            return res.send('User details not found');
        }

        // Compare old password
        const passwordMatch = await bcrypt.compare(oldPassword, userDetails.password);
        if (!passwordMatch) {
            return res.send('Incorrect old password');
        }

        // Hash and update the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userDetails.password = hashedPassword;
        await userDetails.save();
        res.render('login');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.send('Error resetting password');
    }
});


// Login route (POST request)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user;
        let userModel;
  
        // Determine the user model based on user type
        switch (req.body.userType) {
          case 'student':
              userModel = require('./src/models/student');
              break;
          case 'tnp':
              userModel = require('./src/models/tnp');
              break;
          case 'recruiter':
              userModel = require('./src/models/recruiter');
              break;
          case 'faculty':
                userModel = require('./src/models/faculty');
                break;
          case 'hod':
              userModel = require('./src/models/hod');
              break;
          default:
              return res.send('Invalid user type');
      }
  
      // Find user by email in the appropriate model
      user = await userModel.findOne({ email });
  
      if (!user) {
          return res.send('Email not found');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.send('Incorrect password');
      }
      // Set up session
      req.session.userId = user._id;
      req.session.userType = req.body.userType;
      // Redirect to appropriate page based on user type
      switch (req.body.userType) {
        case 'student':
            res.redirect('/student');
            break;
        case 'tnp':
            res.redirect('/TnP');
            break;
        case 'recruiter':
            res.redirect('/recruiter');
            break;
        case 'faculty':
        case 'hod':
            res.redirect('/department');
            break;
        default:
            res.redirect('/');
            break;
    }
    } catch (error) {
        console.error(error);
        res.send('Error logging in');
    }
  });
  

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
});


// Now we are building the student module features 
app.get('/updateProfile', requireAuth, restrictToUserType(['student']), (req, res) => {
    res.render('updateProfile');
});

app.get('/AddEducation',requireAuth,restrictToUserType(['student']), async(req, res) =>{
    try{
        // Retrieve user skills from the database
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const education = user ? user.education : [];
        // console.log(skills);
        // Render the skill.ejs view with the user's skills
        res.render('AddEducation', { education });
    }catch(error){
        console.log(error);
        res.status(500).send('Error fetching Educational details');
    }
})

app.get('/skills',requireAuth,restrictToUserType(['student']), async(req, res) =>{
    try {
        // Retrieve user skills from the database
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const skills = user ? user.skills : [];
        // console.log(skills);
        // Render the skill.ejs view with the user's skills
        res.render('skills', { skills });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching skills');
    }
})


// Update profile route (POST request)
app.post('/update_profile', requireAuth, restrictToUserType(['student']), upload.single('profilePicture'), async (req, res) => {
    const userId = req.session.userId;
    const { name } = req.body;
    const profilePicture = req.file; // Assuming you're using multer for file uploads

    try {
        // Update user's name and profile picture in the database
        const updatedFields = {};
        if (name) {
            updatedFields.name = name;
        }
        if (profilePicture) {
            // Upload profile picture to Cloudinary
            const cloudinaryResponse = await uploadOnCloudinary(profilePicture.path);
            if (cloudinaryResponse) {
                updatedFields.profilePicture = cloudinaryResponse;
            } else {
                throw new Error('Error uploading profile picture to Cloudinary');
            }
        }
        await User.findByIdAndUpdate(userId, updatedFields);

        res.redirect('/student'); // Redirect to student dashboard after updating profile
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/addSkills',requireAuth,  restrictToUserType(['student']),async (req, res) => {
    try {
        // Retrieve user ID from session
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send('User not authenticated');
        }

        // Retrieve skill from request body
        const { skill } = req.body;

        // Update user's skills in the database
        await User.findByIdAndUpdate(userId, { $push: { skills: skill } });

        // Redirect back to the skill page
        res.redirect('/skills');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding skill');
    }
});

app.get('/appliedStatus',requireAuth,  restrictToUserType(['student']),async (req, res) =>{
    res.render('appliedStatus');
});

app.post('/updateEducation', async (req, res) => {
    try {
        // Retrieve user ID from session
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send('User not authenticated');
        }

        // Extract education details from the request body
        const { tenthPercentage, twelfthPercentage, btechPercentage } = req.body;

        // Construct the education object
        const education = [
            { type: '10th', percentage: parseFloat(tenthPercentage) },
            { type: '12th', percentage: parseFloat(twelfthPercentage) },
            { type: 'B.Tech', percentage: parseFloat(btechPercentage) }
        ];

        // Update user's education details in the database
        await User.findByIdAndUpdate(userId, { education: education });

        // Redirect back to the AddEducation page
        res.redirect('/AddEducation');
    } catch (error) {
        console.error(error);
        res.send('Error adding education details');
    }
});

// job posting
app.post('/job_postings', async (req, res) => {
    try {
        const {
          companyName,
          profile,
          skillsRequired,
          eligibility,
          description,
          applyLink,
          lastDate,
          timing,
        } = req.body;
        
        // Create a new job posting document
        const jobPosting = new JobPosting({
          companyName,
          profile,
          skillsRequired: skillsRequired
            .split(",")
            .map((skill) => skill.trim()), // Convert comma-separated skills to an array
          eligibility,
          description,
          applyLink,
          lastDate,
          timing
        });

        // Save the job posting to the database
        await jobPosting.save();
        res.render('TnP', { successMessage: 'Job posted successfully' }); // Render the same page with a success message
    } catch (error) {
        console.error(error);
        res.send('Error adding job posting');
    }
});



// palcement routes ynha pe hai
app.get('/placement', (req,res)=>{
    res.render('placement');
});

app.get('/notify', (req,res)=>{
    res.render('notify');
})

// Route to handle form submission
app.post('/submit-notification', async (req, res) => {
    try {
      // Create a new job notification instance
      const newNotification = new JobNotification({
        title: req.body.title,
        company: req.body.company,
        description: req.body.description,
        expectedDate: req.body.expectedDate
      });
  
      // Save the notification to the database
      await newNotification.save();
  
      res.status(200).send("Notification submitted successfully!");
    } catch (error) {
      console.error("Error submitting notification:", error);
      res.status(500).send("Internal server error");
    }
  });

  // Delete notifications after expected date
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
  
  // Schedule to run deleteExpiredNotifications every day
  setInterval(deleteExpiredNotifications, 24 * 60 * 60 * 1000);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



