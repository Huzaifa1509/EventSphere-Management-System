const Expo = require("../Models/Expo");
const Booth = require("../Models/Booth");
const User = require("../Models/User")
const {Attendee, 
  // ExhibitorInteraction,
  //  Exhibitor,
    Session}= require("../Models/Attendee");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//attende register for Expo
const registerForExpo = async (req, res) => {
  try {
    const { expoId } = req.params; // Destructure expoId from request params
    const { userId } = req.user;   // Extract userId from request user object

    // Validate required inputs
    if (!expoId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: !expoId ? "Expo ID is required" : "User ID is missing" 
      });
    }

    // Fetch Expo and User details in parallel
    const [specificExpo, attendee] = await Promise.all([
      Expo.findById(expoId),
      User.findOne({ _id: userId, role: "ATTENDEE" }),
    ]);

    if (!specificExpo) {
      return res.status(404).json({ success: false, message: "Expo not found" });
    }

    if (!attendee) {
      return res.status(404).json({ success: false, message: "Attendee not found" });
    }

    // Check if attendee exists and is already registered for the expo
    const specificAttendee = await Attendee.findOne({ AttendeeId: userId });

    if (specificAttendee?.exposRegistered.includes(expoId)) {
      return res.status(409).json({ 
        success: false, 
        message: "You have already registered for this Expo" 
      });
    }

    // Register the attendee
    let attendeeResponse;
    if (specificAttendee) {
      // Add the expoId to existing attendee
      specificAttendee.exposRegistered.push(expoId);
      attendeeResponse = await specificAttendee.save();
    } else {
      // Create a new attendee record
      attendeeResponse = await Attendee.create({
        AttendeeId: attendee._id,
        name: attendee.name,
        email: attendee.email,
        phoneNumber: attendee.phoneNumber,
        organization: attendee.organization,
        exposRegistered: [expoId],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully registered for Expo",
      attendee: attendeeResponse,
    });
  } catch (error) {
    // Handle specific errors (e.g., invalid ObjectId)
    const statusCode = error.name === "CastError" ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? "Invalid Expo ID" : "Expo registration failed",
      error: error.message,
    });
  }
};


//attendee register for session
const registerForSession = async (req, res) => {
  try {
    const { sessionId } = req.params; // Destructure sessionId from params
    const { userId } = req.user; // Extract attendeeId from req.user

    // Validate inputs
    if (!sessionId || !userId) {
      return res.status(400).json({ 
        message: !sessionId ? "Session ID is required" : "User ID is missing" 
      });
    }

    // Find session and attendee in parallel
    const [session, attendee] = await Promise.all([
      Session.findById(sessionId).populate({
        path: "Expo",
        strictPopulate: false,
      }),
      Attendee.findOne({AttendeeId: userId}),
    ]);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    const registeredAttendeesCount = await Attendee.countDocuments({
      sessionsRegistered: sessionId,
    });

    // Check session capacity
    if (registeredAttendeesCount >= session.capacity) {
      return res.status(400).json({ message: "Session is full" });
    }

    // Check if already registered
    if (attendee.sessionsRegistered.includes(sessionId)) {
      return res.status(409).json({ message: "Already registered for this session" });
    }

    // Register attendee for the session
    attendee.sessionsRegistered.push(sessionId);

    // Save both documents in parallel
    await Promise.all([attendee.save(), session.save()]);

    return res.status(200).json({
      message: "Successfully registered for session",
      session: {
        id: session._id,
        name: session.name,
        expo: session.expo.name,
      },
    });
  } catch (error) {
    // Handle specific errors
    const statusCode = error.name === "CastError" ? 400 : 500;
    return res.status(statusCode).json({
      message: statusCode === 400 ? "Invalid Session ID" : "Session registration failed",
      error: error.message,
    });
  }
};


//attende bookmark the session
const bookmarkSession = async (req, res) => {
  try {
    const { sessionId } = req.params; // Extract session ID from request params
    const { userId } = req.user; // Extract attendee ID from user object

    // Validate input
    if (!sessionId || !userId) {
      return res.status(400).json({
        message: !sessionId ? "Session ID is required" : "Attendee ID is missing",
      });
    }

    // Fetch session and attendee concurrently
    const [session, attendee] = await Promise.all([
      Session.findById(sessionId),
      Attendee.findOne({AttendeeId: userId}),
    ]);

    // Validate session and attendee existence
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    // Check if already bookmarked
    if (attendee.bookmarkedSessions.includes(sessionId)) {
      return res.status(409).json({ message: "Session already bookmarked" });
    }

    // Bookmark the session
    attendee.bookmarkedSessions.push(sessionId);
    await attendee.save();

    // Respond with success
    return res.status(200).json({
      message: "Session bookmarked successfully",
      session: {
        id: session._id,
        name: session.name,
      },
    });
  } catch (error) {
    // Handle errors
    const statusCode = error.name === "CastError" ? 400 : 500;
    return res.status(statusCode).json({
      message: statusCode === 400 ? "Invalid Session ID" : "Bookmarking failed",
      error: error.message,
    });
  }
};

// Exhibitor Interaction
// const interactWithExhibitor = async (req, res) => {
//   try {
//     const { exhibitorId, interactionType, notes } = req.body;
//     const attendeeId = req.user.userId;

//     // Find exhibitor and attendee
//     // const exhibitor = await Exhibitor.findById(exhibitorId);
//     const attendee = await Attendee.findOne({AttendeeId: attendeeId});

//     // if (!exhibitor) {
//     //   return res.status(404).json({ message: "Exhibitor not found" });
//     // }

//     // Create interaction
//     // const interaction = new ExhibitorInteraction({
//     //   attendee: attendeeId,
//     //   exhibitor: exhibitorId,
//     //   interactionType,
//     //   notes,
//     // });

//     await interaction.save();

//     // Add to attendee and exhibitor interactions
//     // attendee.exhibitorInteractions.push(exhibitorId);
//     // exhibitor.interactions.push(interaction._id); 

//     await attendee.save();
//     // await exhibitor.save();

//     res.status(200).json({
//       message: "Exhibitor interaction recorded",
//       interaction: {
//         id: interaction._id,
//         // exhibitor: exhibitor.name,
//         type: interaction.interactionType,
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Interaction failed", error: error.message });
//   }
// };

// Notification Preferences
const updateNotificationPreferences = async (req, res) => {
  try {
    const attendeeId = req.user.userId;
    const { email, sms} = req.body;

    // Validate that email, sms, and push are provided and are booleans
    if (typeof email !== 'boolean' || typeof sms !== 'boolean') {
      return res.status(400).json({
        message: "Invalid data format. 'email', 'sms' must be boolean values."
      });
    }

    // Find and update attendee notification preferences
    const updatedAttendee = await Attendee.findOneAndUpdate(
      {AttendeeId: attendeeId},
      {
        "notificationPreferences.email": email,
        "notificationPreferences.sms": sms,
      },
      { new: true } // Return the updated document
    );

    if (!updatedAttendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    // Respond with success message and the updated notification preferences
    res.json({
      message: "Notification preferences updated successfully",
      notificationPreferences: updatedAttendee.notificationPreferences,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

// Get User Schedule
const getUserSchedule = async (req, res) => {
  try {
    const attendeeId = req.user.userId;

    // Find attendee and populate references
    const attendee = await Attendee.findOne({ AttendeeId: attendeeId })
      .populate({
        path: "exposRegistered",
        select: "name startDate endDate location", // Fields in the Expo schema
      })
      .populate({
        path: "sessionsRegistered",
        select: "name startTime endTime floor expo",
      })
      .populate({
        path: "bookmarkedSessions",
        select: "name startTime endTime floor expo",
      });

    // Check if attendee exists
    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    // Return structured response
    res.json({
      eventsRegistered: attendee.exposRegistered,
      sessionsRegistered: attendee.sessionsRegistered,
      bookmarkedSessions: attendee.bookmarkedSessions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Could not retrieve schedule",
      error: error.message,
    });
  }
};



module.exports = {
  getUserSchedule,
  updateNotificationPreferences,
  // interactWithExhibitor,
  bookmarkSession,
  registerForExpo,
  registerForSession
};



//Testing remaining on postman