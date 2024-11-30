const Expo = require("../Models/Expo");
const Booth = require("../Models/Booth");
const mongoose = require("mongoose");

const createExpo = async (req, res) => {
    const { name, description, startDate, endDate, venue, organizerName, organizerContact, totalBooths } = req.body;
  
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
    if (!venue || venue.trim() === '') {
      return res.status(400).json({ message: "Venue is required" });
    }
    if (!organizerName || organizerName.trim() === '') {
      return res.status(400).json({ message: "Organizer name is required" });
    }
    if (!organizerContact || !/^\d{10}$/.test(organizerContact)) {
      return res.status(400).json({ message: "Organizer contact must be a 10-digit number" });
    }
    if (!totalBooths || totalBooths < 1) {
      return res.status(400).json({ message: "Total booths must be at least 1" });
    }
  
    try {
      // Create the Expo
      const newExpo = await Expo.create({
        name,
        description,
        startDate,
        endDate,
        venue,
        organizerName,
        organizerContact,
        totalBooths
      });
  
      const expoId = newExpo._id; // The ID of the newly created Expo
  
      // Generate booths for the Expo
      const booths = [];
      for (let i = 0; i < totalBooths; i++) {
        const boothNumber = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit unique booth number
        booths.push({
          boothNumber,
          expoId
        });
      }
  
      // Insert booths into the Booth collection
      const createdBooths = await Booth.insertMany(booths);
  
      // Update the expo document with the created booth references
      newExpo.booths = createdBooths.map(booth => booth._id);
      await newExpo.save();
  
      return res.status(201).json({ message: "Expo and booths created successfully", expo: newExpo });
    } catch (error) {
      console.error("Error creating expo:", error);
      return res.status(500).json({ message: "An error occurred while creating the expo", error: error.message });
    }
  };
  
const getAllExpos = async (req, res) => {
    try {
      const expos = await Expo.find().populate("booths"); // Populate booths for each expo
      return res.status(200).json(expos);
    } catch (error) {
      console.error("Error fetching expos:", error);
      return res.status(500).json({ message: "An error occurred while fetching expos", error: error.message });
    }
  };
  
  // Get a single Expo by ID
  const getExpoById = async (req, res) => {
    const { expoId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(expoId)) {
      return res.status(400).json({ message: "Invalid expo ID" });
    }
  
    try {
      const expo = await Expo.findById(expoId).populate("booths"); // Populate booths for this expo
      if (!expo) {
        return res.status(404).json({ message: "Expo not found" });
      }
      return res.status(200).json(expo);
    } catch (error) {
      console.error("Error fetching expo:", error);
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
  
      // Optionally, delete the booths related to the expo
      await Booth.deleteMany({ expoId });
  
      return res.status(200).json({ message: "Expo deleted successfully" });
    } catch (error) {
      console.error("Error deleting expo:", error);
      return res.status(500).json({ message: "An error occurred while deleting the expo", error: error.message });
    }
  };

module.exports = {
  createExpo,
  getAllExpos,
  getExpoById,
  deleteExpo
};
