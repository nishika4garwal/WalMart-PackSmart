const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
    boxId: {
        type: Number,
        required: true,
        unique: true,
    },
    length: {
        type: Number,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    volume: {
        type: Number, // cm³
        required: true,
    },
    materialType: {
        type: String,
        required: true,
    },
    madeOfRecycledMaterial: {
        type: String,
        default: false,
    },
    reusable: {
        type: String,
        default: false,
    },
    maxWeightSupport: {
        type: Number, // in kg
        required: true,
    },
    co2Footprint: {
        type: Number, // kg CO2e
        required: true,
    },
});

module.exports = mongoose.model("Box", boxSchema);
