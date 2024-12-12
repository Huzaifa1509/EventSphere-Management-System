const mongoose = require("mongoose");


const AttendeeSchema = new mongoose.Schema({
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
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phoneNumber: {
    type: String,
    trim: true
  },

  // Professional Information
  company: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },

  // Event Participation
  exposRegistered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo'
  }],
  sessionsRegistered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }],
  bookmarkedSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }],

  // Communication Preferences
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    }
  },

  // // Exhibitor Interactions
  // exhibitorInteractions: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'ExhibitorInteraction'
  // }],

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attendee', AttendeeSchema);
