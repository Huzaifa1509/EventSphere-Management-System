const Company = require("../Models/Company");
const Exhibitor = require("../Models/Exhibitor");
const User = require("../Models/User");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOSTNAME,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const createExhibitor = async (req, res) => {
  const { userId } = req.user;
  const { productName, productDescription, expoId, boothId, companyId } = req.body;
  console.log(req.body);
  // Check required fields

  if (!productName || productName.trim() === '') {
    return res.status(400).json({ message: "Product name is required" });
  }

  try {

    const RequestExists = await Exhibitor.findOne({ companyId, expoId });
    if (RequestExists) {
      return res.status(400).json({ message: "This Company had Already Request For Booths In This Expo!" });
    }

    //Create the Exhibitor Company/Org
    const newExhibitor = await Exhibitor.create({
      productName,
      productDescription,
      expoId,
      boothId,
      userId,
      companyId
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

const getAllExhibitorsCompany = async (req, res) => {
  const { isAccepted } = req.query;
  console.log(isAccepted);
  try {
    const ExhibitorsCompany = await Exhibitor.find({ isAccepted: Boolean(isAccepted) })
      .populate({
        path: 'expoId',
        model: 'Expo',
      })
      .populate({
        path: 'boothId',
        model: 'Booth',
      })
      .populate({
        path: 'userId',
        model: 'User',
      })
      .populate({
        path: 'companyId',
        model: 'Company',
      });

    const boothIdCounts = {};
    ExhibitorsCompany.forEach((exhibitor) => {
      const boothId = exhibitor.boothId?._id?.toString();
      if (boothId) {
        boothIdCounts[boothId] = (boothIdCounts[boothId] || 0) + 1;
      }
    });

    const result = ExhibitorsCompany.map((exhibitor) => {
      const boothId = exhibitor.boothId?._id?.toString();
      return {
        ...exhibitor.toObject(),
        requestByAnotherCompany: boothId && boothIdCounts[boothId] > 1,
      };
    });
      
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching expos:", error);
    return res.status(500).json({ message: "An error occurred while fetching expos", error: error.message });
  }
};

const ExhibitorIsAccepted = async (req, res) => {
  const { ExhibitorId } = req.params;
  const { isAccepted } = req.body;

  if (!mongoose.Types.ObjectId.isValid(ExhibitorId)) {
    return res.status(400).json({ message: "Invalid Exhibior ID" });
  }
 
  try {
    const AcceptExhibitor = await Exhibitor.findById(ExhibitorId);
    const booths = await Booth.findById(AcceptExhibitor.boothId);
    if(booths.count >= 1){
      return res.status(400).json({ message: "Booth is already Booked" });
    }
    if (!AcceptExhibitor) {
      return res.status(404).json({ message: "Exhibior not found" });
    }

    AcceptExhibitor.isAccepted = Boolean(isAccepted);
    console.log(AcceptExhibitor);
    await AcceptExhibitor.save();

    return res.status(200).json({ message: "Exhibitor Request Accepted Successfully", AcceptExhibitor });
  } catch (error) {
    console.error("Error updating booth:", error);
    return res.status(500).json({ message: "An error occurred while updating the Exhibitor", error: error.message });
  }
};

const ContactInfoExchange = async (req, res) => {
  try {
    const { userId,  } = req.user;
    const { ExhibitorId } = req.params;
    const GetUser = await User.findById(userId);
    const GetExhibitorsRequest = await Exhibitor.findById(ExhibitorId)
    .populate({
      path: 'expoId',
      model: 'Expo',
    })
    .populate({
      path: 'boothId',
      model: 'Booth',
    })
    .populate({
      path: 'userId',
      model: 'User',
    })
    .populate({
      path: 'companyId',
      model: 'Company',
    });

    const mailOptions = {
      from: '"Event Sphere" eventsphere@worldoftech.company', // Sender address
      to: GetUser.email, // Recipient
      cc: GetExhibitorsRequest.companyId.companyEmail,
      subject: 'Requested Contact Info Recieved!',
      html: `<p>Hi ${GetUser.name},</p>
      <p>Company Name: ${GetExhibitorsRequest.companyId.companyName}</p>
      <p>Company Description: ${GetExhibitorsRequest.companyId.companyDescription}</p>
      <p>Company Email: ${GetExhibitorsRequest.companyId.companyEmail}</p>
      <p>Company Contact: ${GetExhibitorsRequest.companyId.companyContact}</p>
      <p>Company Service: ${GetExhibitorsRequest.companyId.companyService}</p>
      <p>Company Address: ${GetExhibitorsRequest.companyId.companyAddress}</p>`

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Verification email sent:', info.response);
      
    return res.status(200).json(GetExhibitorsRequest);
    });
  }
  catch (error) {
    console.error("Error sending message :", error);
    return res.status(500).json({ message: "An error occurred while getting email", error: error.message });
  }
}
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

const allExhibitors = async(req,res) => {
  try {
    const exhibitors = await Exhibitor.find().populate({
      path: 'expoId',
      model: 'Expo',
    }).populate({
      path: 'boothId',
      model: 'Booth',
    }).populate({
      path: 'userId',
      model: 'User',
    }).populate({
      path: 'companyId',
      model: 'Company',
    });
    return res.status(200).json(exhibitors);
  } catch (error) {
    console.error("Error fetching exhibitors:", error);
    return res.status(500).json({ message: "An error occurred while fetching exhibitors", error: error.message });
  }
}

module.exports = {
  createExhibitor,
  getAllExhibitorsCompany,
  ExhibitorIsAccepted,
  ContactInfoExchange,
  allExhibitors
  //   getExpoById,
  //   deleteExpo
};
