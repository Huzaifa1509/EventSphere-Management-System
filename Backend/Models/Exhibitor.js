const mongoose = require('mongoose');

const exhibitorSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    companyDescription: {
        type: String,
        maxLength: 500,
    },
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    services: {
        type: String,
        required: true,
    },
    // requireDocument: {
    //     type: String,
    //     required: true,
    // },
    // booths: [{ 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: "Booth" 
    //   }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const exhibitor = mongoose.model('exhibitor', exhibitorSchema);
module.exports = exhibitor;
