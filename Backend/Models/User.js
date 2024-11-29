const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Exhibitor', 'Attendee'],
        default: 'Attendee',
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    organization: {
        type: String,
        required: function () {
            return this.role === 'Organizer'; 
        },
    },
    profilePicture: {
        type: String,
        default: 'https://example.com/default-avatar.png',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
