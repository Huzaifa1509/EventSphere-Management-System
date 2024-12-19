const Booth = require("../Models/Booth");
const Expo = require("../Models/Expo");
const mongoose = require("mongoose");


const addBooth = async (req, res) => {
    const { boothNumber, expoId } = req.body;
  
    if (!boothNumber || boothNumber.trim() === '') {
      return res.status(400).json({ message: "Booth number is required" });
    }
    if (!expoId || !mongoose.Types.ObjectId.isValid(expoId)) {
      return res.status(400).json({ message: "Valid expo ID is required" });
    }
  
    try {
      const boothExists = await Booth.findOne({ boothNumber });
      if (boothExists) {
        return res.status(400).json({
          message: `A booth with number ${boothNumber} already exists.`,
        });
      }
  
      const expo = await Expo.findById(expoId);
      if (!expo) {
        return res.status(404).json({ message: "Expo not found" });
      }
  
      const newBooth = await Booth.create({ boothNumber, expoId });
  
      expo.booths.push(newBooth._id);
      await expo.save();
  
      return res.status(201).json({
        message: "Booth added successfully",
        booth: newBooth,
      });
    } catch (error) {
      console.error("Error adding booth:", error);
      return res.status(500).json({
        message: "An error occurred while adding the booth",
        error: error.message,
      });
    }
  };
  


const getAllBooths = async (req, res) => {
  try {
    const booths = await Booth.find().populate("expoId", "name venue startDate endDate");
    return res.status(200).json(booths);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching booths", error: error.message });
  }
};

const getBoothsByExpo = async (req, res) => {
  const { expoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(expoId)) {
    return res.status(400).json({ message: "Invalid expo ID" });
  }

  try {
    const booths = await Booth.find({ expoId });
    console.log(booths);
    if (booths.length === 0) {
      return res.status(404).json({ message: "No booths found for this expo" });
    }
    return res.status(200).json(booths);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching booths", error: error.message });
  }
};

const updateBooth = async (req, res) => {
  const { boothId } = req.params;
  const { boothNumber } = req.body;

  if (!mongoose.Types.ObjectId.isValid(boothId)) {
    return res.status(400).json({ message: "Invalid booth ID" });
  }

  try {
    const booth = await Booth.findById(boothId);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    if (boothNumber) {
      const duplicateBooth = await Booth.findOne({ boothNumber, expoId: booth.expoId, _id: { $ne: boothId } });
      if (duplicateBooth) {
        return res.status(400).json({ message: "Booth number already exists for this expo" });
      }
      booth.boothNumber = boothNumber;
    }

    await booth.save();
    return res.status(200).json({ message: "Booth updated successfully", booth });
  } catch (error) {
    console.error("Error updating booth:", error);
    return res.status(500).json({ message: "An error occurred while updating the booth", error: error.message });
  }
};


const BoothIsBooked = async (req, res) => {
  const { boothId } = req.params;
  const { isBooked } = req.params;

  if (!mongoose.Types.ObjectId.isValid(boothId)) {
    return res.status(400).json({ message: "Invalid booth ID" });
  }

  try {
    const booth = await Booth.findById(boothId);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    booth.isBooked = isBooked;
    console.log(booth);
    await booth.save();
    return res.status(200).json({ message: "Booth updated successfully", booth });
  } catch (error) {
    console.error("Error updating booth:", error);
    return res.status(500).json({ message: "An error occurred while updating the booth", error: error.message });
  }
};

const deleteBooth = async (req, res) => {
  const { boothId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(boothId)) {
    return res.status(400).json({ message: "Invalid booth ID" });
  }

  try {
    const booth = await Booth.findByIdAndDelete(boothId);
    if (!booth) {
      return res.status(404).json({ message: "Booth not found" });
    }

    await Expo.findByIdAndUpdate(booth.expoId, { $pull: { booths: boothId } });

    return res.status(200).json({ message: "Booth deleted successfully" });
  } catch (error) {
    console.error("Error deleting booth:", error);
    return res.status(500).json({ message: "An error occurred while deleting the booth", error: error.message });
  }
};

module.exports = {
  addBooth,
  getAllBooths,
  getBoothsByExpo,
  updateBooth,
  deleteBooth,
  BoothIsBooked
};
