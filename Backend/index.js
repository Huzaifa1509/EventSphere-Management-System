require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const userController = require('./Controllers/UserController');
const expoController = require('./Controllers/ExpoController'); // Import the Expo controller
const AttendeeController = require('./Controllers/AttendeeController');
const protect = require('./Middlewares/token_decode');
const connectDB = require('./Configuration/db_config');

// CORS options
const corsOptions = {
    origin: 'http://localhost:3000',
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
app.delete('/api/users/:userId', userController.deleteUser);
app.post('/api/users/login', userController.loginUser);
app.get('/api/users/profile', protect, userController.getProfile);
app.put('/api/users/:userId', userController.updateUser);

// Expo routes
app.post('/api/expos', expoController.createExpo); ///to create an Expo
app.get('/api/expos', expoController.getAllExpos); //to get all Expos
app.get('/api/expos/:expoId', expoController.getExpoById); /// to get a specific Expo by ID
app.delete('/api/expos/:expoId', expoController.deleteExpo); //to delete an Expo

//Attende routes
app.post('/registerForExpo/:expoId',protect, AttendeeController.registerForExpo);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await connectDB(); // Connect to the database
});
