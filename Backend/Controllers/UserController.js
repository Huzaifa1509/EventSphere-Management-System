const User = require('../Models/User');
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, organization } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        console.table({ name, email, password, role, phone, organization });

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
        if (!emailRegex.test(email)) {
            console.log(email)
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            console.log(password)
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain both letters and numbers." });
        }

        if (role === 'ORGANIZER' && (!organization || organization.trim() === '')) {
            console.log(organization)
            return res.status(400).json({ message: "Organization is required for the 'Organizer' role" });
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        console.log(hashedPassword)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            organization,
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                organization: newUser.organization,
                profilePicture: newUser.profilePicture,
                createdAt: newUser.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const salt = await bcryptjs.genSalt(10)
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            organization: user.organization,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, phone, profilePicture, organization } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (profilePicture) user.profilePicture = profilePicture;
        if (organization && user.role === 'Organizer') user.organization = organization;

        user.updatedAt = Date.now();

        await user.save();

        res.json({
            message: "User updated successfully",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                organization: user.organization,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.remove();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgetPassword = async (req, res) => {
    const { email, password } = req.body;

    console.table({ email, password });

    if(!email){
        console.log("Email Not Found:", email)
        return res.status(400).json({ message: "Email is required" });
    }

    if(!password){
        console.log("Password Not Found:", password)
        return res.status(400).json({ message: "Password is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User Not Found:", user)
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log(user)

        const salt = await bcryptjs.genSalt(10)

        user.password = await bcryptjs.hash(password, salt)
        await user.save()


        console.log("Password Updated Successfully")

        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.log(error)
        console.log(error?.message)
        res.status(500).json({ message: error.message });
    }

}

const getUserCount = async (req, res) => {
    try {
        // Using aggregation to get counts based on roles
        const userCount = await User.aggregate([
            {
                $match: {
                    role: { $in: ["ATTENDEE", "EXHIBITOR"] }
                }
            },
            {
                $group: {
                    _id: "$role", 
                    count: { $sum: 1 }
                }
            }
        ]);

        const attendeesCount = userCount.find(item => item._id === "ATTENDEE")?.count || 0;
        const exhibitorsCount = userCount.find(item => item._id === "EXHIBITOR")?.count || 0;

        console.log("User Count:", userCount);

        console.table({ attendeesCount, exhibitorsCount });

        const result = {
            ATTENDEES: attendeesCount,
            EXHIBITORS: exhibitorsCount,
        };

        console.log(result); // Log the counts
        res.status(200).json({ userCount: result });
    } catch (error) {
        console.log(error); // Log error for debugging
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, loginUser, getProfile, updateUser, getAllUsers, deleteUser, forgetPassword, getUserCount };
