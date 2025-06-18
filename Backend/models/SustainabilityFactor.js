const mongoose = require("mongoose");

const sustainabilityFactorSchema = new mongoose.Schema({
    material: {
        type: String,
        required: true,
        unique: true,
    },
    co2PerKg: {
        type: Number, // kg CO2e per kg
        required: true,
    },
    recyclable: {
        type: Boolean,
        default: false,
    },
    biodegradable: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("SustainabilityFactor", sustainabilityFactorSchema);
