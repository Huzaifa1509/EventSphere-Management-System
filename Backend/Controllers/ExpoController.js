const Expo = require("../Models/Expo");
const Booth = require("../Models/Booth");

const createExpo = async (req, res) => {
  const { name, description, startDate, endDate, venue, organizerName, organizerContact, totalBooths } = req.body;

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
    await Booth.insertMany(booths);

    return res.status(201).json({ message: "Expo and booths created successfully", expo: newExpo });
  } catch (error) {
    console.error("Error creating expo:", error);
    return res.status(500).json({ message: "An error occurred while creating the expo", error: error.message });
  }
};

module.exports = {
  createExpo
};
