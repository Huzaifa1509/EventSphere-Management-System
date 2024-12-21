const mongoose = require("mongoose");

const expoSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Expo name is required"], 
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, "Description is required"], 
    trim: true 
  },
  startDate: { 
    type: Date, 
    required: [true, "Start date is required"] 
  },
  endDate: { 
    type: Date, 
    required: [true, "End date is required"] 
  },
  venue: { 
    type: String, 
    required: [true, "Venue is required"], 
    trim: true 
  },
  organizerName: { 
    type: String, 
    required: [true, "Organizer name is required"], 
    trim: true 
  },
  organizerContact: { 
    type: String, 
    required: [true, "Organizer contact is required"],   },
  totalBooths: { 
    type: Number, 
    required: [true, "Total booths are required"], 
    min: [1, "Total booths must be at least 1"] 
  },
  totalBoothsf2: { 
    type: Number, 
  },
  totalBoothsf3: { 
    type: Number, 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  booths: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Booth" 
  }]
});

module.exports = mongoose.model("Expo", expoSchema);