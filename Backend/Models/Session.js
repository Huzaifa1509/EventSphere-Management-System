const mongoose = require("mongoose");


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
  day:{
    type: Number
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


const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;