const Exhibitor = require("../Models/Exhibitor");
const Booth = require("../Models/Booth");
const mongoose = require("mongoose");

const createExhibitor = async (req, res) => {
  const { companyName, companyDescription, productName, productDescription, services } = req.body;

  // Check required fields
  if (!companyName || companyName.trim() === '') {
    return res.status(400).json({ message: "Company name is required" });
  }
  if (!productName || productName.trim() === '') {
    return res.status(400).json({ message: "Product name is required" });
  }
  if (!services || services.trim() === '') {
    return res.status(400).json({ message: "Service is required" });
  }

  try {
    // Retrieve uploaded file URL from Cloudinary
    let requireDocumentUrl = null;
    if (req.file) {
      requireDocumentUrl = req.file.path; // Uploaded file URL
    } else {
      return res.status(400).json({ message: "Require Document (file) is missing" });
    }

    // Create the Exhibitor Company/Org
    const newExhibitor = await Exhibitor.create({
      companyName,
      companyDescription,
      productName,
      productDescription,
      services,
      requireDocument: requireDocumentUrl, // Save file URL in the database
    });

    await newExhibitor.save();

    return res.status(201).json({
      message: "Company Created Successfully",
      exhibitor: newExhibitor,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    return res.status(500).json({
      message: "An error occurred while creating the company",
      error: error.message,
    });
  }
};

  
// const getAllExpos = async (req, res) => {
//     try {
//       const expos = await Expo.find().populate("booths"); // Populate booths for each expo
//       return res.status(200).json(expos);
//     } catch (error) {
//       console.error("Error fetching expos:", error);
//       return res.status(500).json({ message: "An error occurred while fetching expos", error: error.message });
//     }
//   };
  
//   // Get a single Expo by ID
//   const getExpoById = async (req, res) => {
//     const { expoId } = req.params;
  
//     if (!mongoose.Types.ObjectId.isValid(expoId)) {
//       return res.status(400).json({ message: "Invalid expo ID" });
//     }
  
//     try {
//       const expo = await Expo.findById(expoId).populate("booths"); // Populate booths for this expo
//       if (!expo) {
//         return res.status(404).json({ message: "Expo not found" });
//       }
//       return res.status(200).json(expo);
//     } catch (error) {
//       console.error("Error fetching expo:", error);
//       return res.status(500).json({ message: "An error occurred while fetching the expo", error: error.message });
//     }
//   };
//   const deleteExpo = async (req, res) => {
//     const { expoId } = req.params;
  
//     if (!mongoose.Types.ObjectId.isValid(expoId)) {
//       return res.status(400).json({ message: "Invalid expo ID" });
//     }
  
//     try {
//       const deletedExpo = await Expo.findByIdAndDelete(expoId);
  
//       if (!deletedExpo) {
//         return res.status(404).json({ message: "Expo not found" });
//       }
  
//       // Optionally, delete the booths related to the expo
//       await Booth.deleteMany({ expoId });
  
//       return res.status(200).json({ message: "Expo deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting expo:", error);
//       return res.status(500).json({ message: "An error occurred while deleting the expo", error: error.message });
//     }
//   };

module.exports = {
    createExhibitor,
//   getAllExpos,
//   getExpoById,
//   deleteExpo
};
