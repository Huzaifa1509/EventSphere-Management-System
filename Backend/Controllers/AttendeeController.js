const Expo = require("../Models/Expo");
const Booth = require("../Models/Booth");
const User = require("../Models/User")
const {Attendee, ExhibitorInteraction, Exhibitor, Session}= require("../Models/Attendee");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//attende register for Expo
const registerForExpo = async (req, res) => {
  try {
    const ExpoId = req.params.expoId;
    const userId = req.user.userId;

    // Find Expo and attendee
    const specificExpo = await Expo.findById(ExpoId);
    const attendee = await User.findOne({ _id: userId, role: "ATTENDEE" });

    if (!specificExpo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    // Register for Expo
    const newAttendee = await Attendee.create({
      name: attendee.name,
      email: attendee.email,
      phoneNumber: attendee.phone,
      organization: attendee.organization,
      exposRegistered: [ExpoId], // Initialize with the Expo ID
    });

    res.status(200).json({
      message: "Successfully registered for Expo",
      attendee: newAttendee,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Expo registration failed", error: error.message });
  }
};

//attendee register for session
const registerForSession = async (req, res) => {
  try {

    const sessionId = req.params.sessionId;
    const attendeeId = req.user.id;


    // Find session and attendee
    const [session, attendee] = await Promise.all([
      await Session.findById(sessionId).populate("expo"),
      await Attendee.findById(attendeeId)
    ]);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check session capacity
    if (session.attendees.length >= session.capacity) {
      return res.status(400).json({ message: "Session is full" });
    }

    // Check if already registered
    if (attendee.sessionsRegistered.includes(sessionId)) {
      return res
        .status(400)
        .json({ message: "Already registered for this session" });
    }

    // Register for session
    attendee.sessionsRegistered.push(sessionId);
    session.attendees.push(attendeeId);

    await attendee.save();
    await session.save();

    res.status(200).json({
      message: "Successfully registered for session",
      session: {
        id: session._id,
        name: session.name,
        event: session.expo.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Session registration failed", error: error.message });
  }
};

//attende bookmark the session
const bookmarkSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const attendeeId = req.user.id;

    // Find session and attendee
    const [session, attendee] = await Promise.all([
      await Session.findById(sessionId),
      await Attendee.findById(attendeeId)
    ]);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if already bookmarked
    if (attendee.bookmarkedSessions.includes(sessionId)) {
      return res.status(400).json({ message: "Session already bookmarked" });
    }

    // Bookmark session
    attendee.bookmarkedSessions.push(sessionId);
    await attendee.save();

    res.status(200).json({
      message: "Session bookmarked successfully",
      session: {
        id: session._id,
        name: session.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bookmarking failed", error: error.message });
  }
};

// Exhibitor Interaction
const interactWithExhibitor = async (req, res) => {
  try {
    const { exhibitorId, interactionType, notes } = req.body;
    const attendeeId = req.user.id;

    // Find exhibitor and attendee
    const exhibitor = await Exhibitor.findById(exhibitorId);
    const attendee = await Attendee.findById(attendeeId);

    if (!exhibitor) {
      return res.status(404).json({ message: "Exhibitor not found" });
    }

    // Create interaction
    const interaction = new ExhibitorInteraction({
      attendee: attendeeId,
      exhibitor: exhibitorId,
      interactionType,
      notes,
    });

    await interaction.save();

    // Add to attendee and exhibitor interactions
    attendee.exhibitorInteractions.push(interaction._id);
    exhibitor.interactions.push(interaction._id);

    await attendee.save();
    await exhibitor.save();

    res.status(200).json({
      message: "Exhibitor interaction recorded",
      interaction: {
        id: interaction._id,
        exhibitor: exhibitor.name,
        type: interaction.interactionType,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Interaction failed", error: error.message });
  }
};

// Notification Preferences
const updateNotificationPreferences = async (req, res) => {
  try {
    const attendeeId = req.user.id;
    const { email, sms, push } = req.body;

    const updatedAttendee = await Attendee.findByIdAndUpdate(
      attendeeId,
      {
        "notificationPreferences.email": email,
        "notificationPreferences.sms": sms,
        "notificationPreferences.push": push,
      },
      { new: true }
    );

    if (!updatedAttendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    res.json({
      message: "Notification preferences updated",
      notificationPreferences: updatedAttendee.notificationPreferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// Get User Schedule
const getUserSchedule = async (req, res) => {
  try {
    const attendeeId = req.user.id;

    // Populate registered events and sessions
    const attendee = await Attendee.findById(attendeeId)
      .populate({
        path: "exposRegistered",
        select: "name startDate endDate location",
        populate:{
          path: "expo",
          select: "name"
        }
      })
      .populate({
        path: "sessionsRegistered",
        select: "name startTime endTime floor expo",
        populate: {
          path: "expo",
          select: "name",
        },
      })
      .populate({
        path: "bookmarkedSessions",
        select: "name startTime endTime floor expo",
        populate: {
          path: "expo",
          select: "name",
        },
      });

    res.json({
      eventsRegistered: attendee.eventsRegistered,
      sessionsRegistered: attendee.sessionsRegistered,
      bookmarkedSessions: attendee.bookmarkedSessions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not retrieve schedule", error: error.message });
  }
};

const registerExhibitor = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, description, boothNumber, contactEmail } = req.body;

    // Validate required fields
    if (!name || !contactEmail) {
      return res.status(400).json({
        error: "Name and contact email are required."
      });
    }

    // Create a new exhibitor instance
    const exhibitor = new Exhibitor({
      name,
      description,
      boothNumber,
      contactEmail
    });

    // Save the exhibitor to the database
    const savedExhibitor = await exhibitor.save();

    // Respond with the newly created exhibitor
    return res.status(201).json({
      message: "Exhibitor registered successfully.",
      exhibitor: savedExhibitor
    });
  } catch (error) {
    console.error("Error registering exhibitor:", error);

    // Handle validation errors or other issues
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message
      });
    }

    // Respond with a generic server error
    return res.status(500).json({
      error: "An error occurred while registering the exhibitor."
    });
  }
};

module.exports = {
  getUserSchedule,
  updateNotificationPreferences,
  interactWithExhibitor,
  bookmarkSession,
  registerForExpo,
  registerForSession,
  registerExhibitor
};



//Testing remaining on postman