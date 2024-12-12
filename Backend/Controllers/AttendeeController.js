const Expo = require("../Models/Expo");
const Booth = require("../Models/Booth");
const Attendee = require("../Models/Attendee");
// const ExhibitorInteraction = require("../Models/ExhibitorInteraction");
// const Exhibitor = require("../Models/Exhibitor");
// const Session = require("../Models/Session");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Expo and Session Management
const registerForExpo = async (req, res) => {
  try {
    const ExpoId = req.params.expoId;
    const attendeeId = req.user.userId;

    // Find Expo and attendee
    const Expo = await Expo.findById(ExpoId);
    const attendee = await Attendee.findById(attendeeId);

    if (!Expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    // Check if already registered
    if (attendee.exposRegistered.includes(ExpoId)) {
      return res
        .status(400)
        .json({ message: "Already registered for this Expo" });
    }

    // Register for Expo
    attendee.exposRegistered.push(ExpoId);

    await attendee.save();

    res.status(200).json({
      message: "Successfully registered for Expo",
      Expo: {
        id: Expo._id,
        name: Expo.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Expo registration failed", error: error.message });
  }
};


// const registerForSession = async (req, res) => {
//   try {
//     const { sessionId } = req.body;
//     const attendeeId = req.user.id;

//     // Find session and attendee
//     const session = await Session.findById(sessionId).populate("event");
//     const attendee = await Attendee.findById(attendeeId);

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     // Check session capacity
//     if (session.attendees.length >= session.capacity) {
//       return res.status(400).json({ message: "Session is full" });
//     }

//     // Check if already registered
//     if (attendee.sessionsRegistered.includes(sessionId)) {
//       return res
//         .status(400)
//         .json({ message: "Already registered for this session" });
//     }

//     // Register for session
//     attendee.sessionsRegistered.push(sessionId);
//     session.attendees.push(attendeeId);

//     await attendee.save();
//     await session.save();

//     res.status(200).json({
//       message: "Successfully registered for session",
//       session: {
//         id: session._id,
//         name: session.name,
//         event: session.event.name,
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Session registration failed", error: error.message });
//   }
// };



// Bookmark Management

// const bookmarkSession = async (req, res) => {
//   try {
//     const { sessionId } = req.body;
//     const attendeeId = req.user.id;

//     // Find session and attendee
//     const session = await Session.findById(sessionId);
//     const attendee = await Attendee.findById(attendeeId);

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     // Check if already bookmarked
//     if (attendee.bookmarkedSessions.includes(sessionId)) {
//       return res.status(400).json({ message: "Session already bookmarked" });
//     }

//     // Bookmark session
//     attendee.bookmarkedSessions.push(sessionId);
//     await attendee.save();

//     res.status(200).json({
//       message: "Session bookmarked successfully",
//       session: {
//         id: session._id,
//         name: session.name,
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Bookmarking failed", error: error.message });
//   }
// };

// Exhibitor Interaction

// const interactWithExhibitor = async (req, res) => {
//   try {
//     const { exhibitorId, interactionType, notes } = req.body;
//     const attendeeId = req.user.id;

//     // Find exhibitor and attendee
//     const exhibitor = await Exhibitor.findById(exhibitorId);
//     const attendee = await Attendee.findById(attendeeId);

//     if (!exhibitor) {
//       return res.status(404).json({ message: "Exhibitor not found" });
//     }

//     // Create interaction
//     const interaction = new ExhibitorInteraction({
//       attendee: attendeeId,
//       exhibitor: exhibitorId,
//       interactionType,
//       notes,
//     });

//     await interaction.save();

//     // Add to attendee and exhibitor interactions
//     attendee.exhibitorInteractions.push(interaction._id);
//     exhibitor.interactions.push(interaction._id);

//     await attendee.save();
//     await exhibitor.save();

//     res.status(200).json({
//       message: "Exhibitor interaction recorded",
//       interaction: {
//         id: interaction._id,
//         exhibitor: exhibitor.name,
//         type: interaction.interactionType,
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Interaction failed", error: error.message });
//   }
// };

// Profile Management



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
        path: "eventsRegistered",
        select: "name startDate endDate location",
      })
      .populate({
        path: "sessionsRegistered",
        select: "name startTime endTime room speaker event",
        populate: {
          path: "event",
          select: "name",
        },
      })
      .populate({
        path: "bookmarkedSessions",
        select: "name startTime endTime room speaker event",
        populate: {
          path: "event",
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

module.exports = {
  getUserSchedule,
  updateNotificationPreferences,
  // updateProfile,
  // interactWithExhibitor,
  // bookmarkSession,
  registerForExpo,
  // registerForSession,
};
