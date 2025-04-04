const Expo = require("../Models/Expo");
const Booth = require("../Models/Booth");
const mongoose = require("mongoose");

// Create Expo
const createExpo = async (req, res) => {
  const { name, description, startDate, endDate, venue, organizerName, organizerContact, totalBooths, totalBoothsf2, totalBoothsf3 } = req.body;

  //validations
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: "Expo name is required" });
  }
  if (!description || description.trim() === '') {
    return res.status(400).json({ message: "Description is required" });
  }
  if (!startDate || isNaN(Date.parse(startDate))) {
    return res.status(400).json({ message: "Valid start date is required" });
  }
  if (!endDate || isNaN(Date.parse(endDate))) {
    return res.status(400).json({ message: "Valid end date is required" });
  }
  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: "End date must be after the start date" });
  }
  const today = new Date();
  if (new Date(startDate) < today || new Date(endDate) < today) {
    return res.status(400).json({ message: "Event dates cannot be in the past" });
  }
  if (new Date(endDate).getFullYear() > 2025) {
    return res.status(400).json({ message: "Event cannot be scheduled beyond 2025" });
  }
  if (!venue || venue.trim() === '') {
    return res.status(400).json({ message: "Venue is required" });
  }
  if (!organizerName || organizerName.trim() === '') {
    return res.status(400).json({ message: "Organizer name is required" });
  }
  if (!organizerContact || !/^\d{11,14}$/.test(organizerContact)) {
    return res.status(400).json({ message: "Organizer contact must be between 11 and 14 digits" });
  }  
  if (!totalBooths || totalBooths < 1) {
    return res.status(400).json({ message: "Total booths must be at least 1" });
  }

  try {
    const existingExpo = await Expo.findOne({ name });
    if (existingExpo) {
      return res.status(400).json({ message: "Event with this name already exists" });
    }

    const newExpo = await Expo.create({
      name,
      description,
      startDate,
      endDate,
      venue,
      organizerName,
      organizerContact,
      totalBooths,
      totalBoothsf2,
      totalBoothsf3
    });

    const expoId = newExpo._id;


    const createBooths = async (count, floor, expoId) => {
      const booths = [];
      for (let i = 0; i < count; i++) {
        let boothNumber;
        let existingBoothNumber;
        do {
          boothNumber = Math.floor(1000 + Math.random() * 9000).toString();
          existingBoothNumber = await Booth.findOne({ boothNumber });
          if (existingBoothNumber) {
            console.log(`Duplicate booth number detected: ${boothNumber}`);
          }
        } while (existingBoothNumber);
      
        booths.push({ boothNumber, expoId, floor });
      }
      try {
        return await Booth.insertMany(booths);

      } catch (error) {
        console.error(`Error inserting booths for floor ${floor}:`, error);
        throw new Error(`Failed to insert booths for floor ${floor}`);
      }
    };

    const [createdBoothsF1, createdBoothsF2, createdBoothsF3] = await Promise.all([
      createBooths(totalBooths, "F1", expoId),
      totalBoothsf2 > 0 ? createBooths(totalBoothsf2, "F2", expoId) : [],
      totalBoothsf3 > 0 ? createBooths(totalBoothsf3, "F3", expoId) : []
    ]);

    const allBoothIds = [
      ...createdBoothsF1.map(booth => booth._id),
      ...createdBoothsF2.map(booth => booth._id),
      ...createdBoothsF3.map(booth => booth._id)
    ];

    newExpo.booths = allBoothIds;
    await newExpo.save();

    return res.status(201).json({ message: "Expo and booths created successfully", expo: newExpo });
  } catch (error) {
    console.error("Error creating expo:", error);
    return res.status(500).json({ message: "An error occurred while creating the expo", error: error.message });
  }
};

const updateExpo = async (req, res) => {
  const { expoId } = req.params;
  const { name, description, startDate, endDate, venue, organizerName, organizerContact } = req.body;
  console.table({ expoId, name, description, startDate, endDate, venue, organizerName, organizerContact });

  if (!mongoose.Types.ObjectId.isValid(expoId)) {
    return res.status(400).json({ message: "Invalid expo ID" });
  }

  try {
    const expo = await Expo.findById(expoId);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (name && name !== expo.name) {
      const existingExpo = await Expo.findOne({ name });
      if (existingExpo) {
        return res.status(400).json({ message: "Event with this name already exists" });
      }
    }


    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ message: "End date must be after the start date" });
      }
      const today = new Date();
      if (new Date(startDate) < today || new Date(endDate) < today) {
        return res.status(400).json({ message: "Event dates cannot be in the past" });
      }
      if (new Date(endDate).getFullYear() > 2026) {
        return res.status(400).json({ message: "Event cannot be scheduled beyond 2026" });
      }
    }

    expo.name = name || expo.name;
    expo.description = description || expo.description;
    expo.startDate = startDate || expo.startDate;
    expo.endDate = endDate || expo.endDate;
    expo.venue = venue || expo.venue;
    expo.organizerName = organizerName || expo.organizerName;
    expo.organizerContact = organizerContact || expo.organizerContact;

    await expo.save();
    console.log("Expo updated successfully:", expo);
    return res.status(200).json({ message: "Expo updated successfully", expo });
  } catch (error) {
    console.error("Error updating expo:", error);
    return res.status(500).json({ message: "An error occurred while updating the expo", error: error.message });
  }
};


const getAllExpos = async (req, res) => {
  try {
    const expos = await Expo.find().populate("booths").sort({ startDate: -1 });
    return res.status(200).json(expos);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching expos", error: error.message });
  }
};


const getExpoById = async (req, res) => {
  const { expoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(expoId)) {
    return res.status(400).json({ message: "Invalid expo ID" });
  }

  try {
    const expo = await Expo.findById(expoId).populate("booths");
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }
    return res.status(200).json(expo);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching the expo", error: error.message });
  }
};


const deleteExpo = async (req, res) => {
  const { expoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(expoId)) {
    return res.status(400).json({ message: "Invalid expo ID" });
  }

  try {
    const deletedExpo = await Expo.findByIdAndDelete(expoId);

    if (!deletedExpo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    await Booth.deleteMany({ expoId });

    return res.status(200).json({ message: "Expo deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting the expo", error: error.message });
  }
};

module.exports = {
  createExpo,
  updateExpo,
  getAllExpos,
  getExpoById,
  deleteExpo,
};
