require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const userController = require('./Controllers/UserController');
const expoController = require('./Controllers/ExpoController'); // Import the Expo controller
const exhibitorController = require('./Controllers/ExhibitorController'); 
const AttendeeController = require('./Controllers/AttendeeController');
const BoothController = require('./Controllers/BoothController');
const CompanyController = require('./Controllers/CompanyController');
const {verifyOTP, passwordResetOTP} = require('./Controllers/VerifyController')
const {uploadImageHandler} = require("./Middlewares/UploadImageHandler")
const protect = require('./Middlewares/token_decode');
const connectDB = require('./Configuration/db_config');
const upload = uploadImageHandler();

// CORS options
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User routes
app.post('/api/users', userController.createUser);
app.get('/api/allusers', userController.getAllUsers);
app.get('/api/user_count', userController.getUserCount);
app.delete('/api/users/:userId', userController.deleteUser);
app.post('/api/users/login', userController.loginUser);
app.get('/api/users/profile', protect, userController.getProfile);
app.put('/api/users/:userId', userController.updateUser);

// Verify routes
app.post('/api/verify', verifyOTP);
app.post('/api/password-reset-otp', passwordResetOTP);
app.post('/api/reset-password', userController.forgetPassword);

// Expo routes
app.post('/api/expos', expoController.createExpo); ///to create an Expo
app.get('/api/expos', expoController.getAllExpos); //to get all Expos
app.get('/api/expos/:expoId', expoController.getExpoById); /// to get a specific Expo by ID
app.delete('/api/expos/:expoId', expoController.deleteExpo);
app.put('/api/expos/:expoId', expoController.updateExpo); //to delete an Expo

//Booth routes
app.post('/api/booths', BoothController.addBooth);
app.get('/api/booths', BoothController.getAllBooths);
app.get('/api/booths/:expoId', BoothController.getBoothsByExpo);
app.put('/api/booths/:boothId', BoothController.updateBooth);
app.put('/api/boothBooked/:boothId', BoothController.BoothIsBooked);
app.delete('/api/booths/:boothId', BoothController.deleteBooth);


//Attende routes
app.post('/api/register-for-expo/:expoId',protect, AttendeeController.registerForExpo);
app.post('/api/register-for-session/:sessionId',protect, AttendeeController.registerForSession);
app.put('/api/bookmark-session/:sessionId',protect, AttendeeController.bookmarkSession);
// app.post('/api/interact-with-exhibitor', protect, AttendeeController.interactWithExhibitor);
app.put('/api/update-notification-preferences', protect, AttendeeController.updateNotificationPreferences);
app.get('/api/user-schedule', protect, AttendeeController.getUserSchedule);

//Company routes
app.post('/api/register-company', protect, upload.single('requireDocument') , CompanyController.createCompany);
app.get('/api/get-company/:companyId', protect, CompanyController.getCompanyById);
app.get('/api/get-companies-by-exhibitor', protect, CompanyController.GetCompanyByExhibitor);
app.delete('/api/delete-company/:companyId', protect, CompanyController.deleteCompanyById);
app.put('/api/update-company/:companyId', protect, CompanyController.updateCompanyById)
// Exhibitor routes
app.post('/api/exhibitor', protect, exhibitorController.createExhibitor); 
app.get('/api/exhibitor', protect, exhibitorController.getAllExhibitorsCompany); 
app.put('/api/exhibitor/:ExhibitorId', protect, exhibitorController.ExhibitorIsAccepted);
app.get('/api/exhibitor/contact-info-exchange/:ExhibitorId', protect, exhibitorController.ContactInfoExchange);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await connectDB(); // Connect to the database
});
