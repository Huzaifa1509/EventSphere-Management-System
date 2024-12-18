const mongoose = require("mongoose");


// Session Schema
const SessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  floor: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number
  },
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo'
  }
});

// Attendee Schema
const AttendeeSchema = new mongoose.Schema({
  AttendeeId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true,
},
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },

  // Professional Information
  organization: {
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
    }
  },

  // Exhibitor Interactions
  exhibitorInteractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExhibitorInteraction'
  }],

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

// Exhibitor Interaction Schema
const ExhibitorInteractionSchema = new mongoose.Schema({
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendee',
    required: true
  },
  exhibitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exhibitor',
    required: true
  },
  interactionType: {
    type: String,
    enum: ['chat', 'email', 'booth'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Exhibitor Schema
// const ExhibitorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   boothNumber: {
//     type: String,
//     trim: true
//   },
//   contactEmail: {
//     type: String,
//     lowercase: true,
//     trim: true
//   },
//   interactions: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'ExhibitorInteraction'
//   }]
// });

const Attendee = mongoose.model('Attendee', AttendeeSchema);
const ExhibitorInteraction = mongoose.model('ExhibitorInteraction', ExhibitorInteractionSchema);
// const Exhibitor = mongoose.model('Exhibitor', ExhibitorSchema);
const Session = mongoose.model('Session', SessionSchema);


module.exports = {
  Attendee,
  ExhibitorInteraction,
  // Exhibitor,
  Session
}