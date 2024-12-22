const User = require('../Models/User');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOSTNAME, 
    port: process.env.SMTP_PORT, 
    secure: true, 
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS,  
    },
});

const verifyOTP = async (req, res) => {
    try {
        const otp = Math.floor(Math.random() * 9000) + 1000;
        const token = otp.toString();
        const {email, name} = req.body
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!emailRegex.test(email)) {
            console.log(email)
            return res.status(400).json({ message: "Invalid email format" });
        }

        console.table({email, name, token});

        const mailOptions = {
            from: '"Event Sphere" eventsphere@worldoftech.company',
            to: email,
            subject: 'Welcome to Our Platform!',
            html: `<p>Hi ${name},</p>
                   <p>Thank you for registering. Please verify your email to complete your registration:</p>
                   <p>OTP: ${token}</p>
                   <p><a href="http://localhost:5173/verify/${token}">Verify Email</a></p>
                   <p>If you did not register, please ignore this email.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            } 
                console.log('Verification email sent:', info.response);
            
        });
        res.status(200).json({ message: 'Verification email sent successfully', otp: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const passwordResetOTP = async (req, res) => {
    try {
        const {email} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;

        if (!email) {
            console.log("Email Is Required:", email)
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!emailRegex.test(email)) {
            console.log(email)
            return res.status(400).json({ message: "Invalid email format" });
        }

        console.table(email);

        if(email){
            const user = await User.findOne({ email });
            if (!user) {
                console.log("User Not Found:", user)
                return res.status(404).json({ message: 'User not found' });
            }
            console.log("User Found:", user)
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const token = otp.toString();

        const mailOptions = {
            from: '"Event Sphere" eventsphere@worldoftech.company',
            to: email,
            subject: 'Password Reset OTP',
            html: `<p>Hi,</p>
                   <p>Please use the following OTP to reset your password:</p>
                   <p>OTP: ${token}</p>
                   <p><a href="http://localhost:5173/forget-password/${token}">Reset Password</a></p>
                   <p>If you did not request a password reset, please ignore this email.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            } 
                console.log('Verification email sent:', info.response);
            
        });
        res.status(200).json({ message: 'OTP sent successfully', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {verifyOTP, passwordResetOTP}