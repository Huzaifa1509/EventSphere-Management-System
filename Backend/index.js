require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const userController = require('./Controllers/UserController');

const connectDB = require('./Configuration/db_config');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
};

app.use(cors(corsOptions));
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))

app.post('/api/users', userController.createUser);
app.get('/api/allusers', userController.getAllUsers);
app.delete('/api/users/:userId', userController.deleteUser);
app.post('/api/users/login', userController.loginUser);
app.get('/api/users/profile', userController.getProfile);
app.put('/api/users/:userId', userController.updateUser);

const PORT = process.env.PORT ? process.env.PORT : 5000;

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await connectDB();
});
