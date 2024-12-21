const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema({
  boothNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  expoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Expo", 
    required: true 
  },
  floor: {
    type: String,
    required: true
  },
  isBooked: { 
    type: Boolean, 
    default: false 
  },
  Assignedto: { 
    type: String, 
    default: null
  }
});

module.exports = mongoose.model("Booth", boothSchema);