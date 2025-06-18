const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    weight: {
        type: Number, // in kg
        required: true,
    },
    dimensions: {
        height: Number,
        width: Number,
        length: Number, // in cm
    },
    price: {
        type: Number,
        required: true,
    },
    tags: [String],
    approxNoOfLayers: Number,
    layerMaterials: [String],
    materialComposition: [
        {
            material: String,
            percentage: Number,
        },
    ],
    recyclable: Boolean,
    biodegradable: Boolean,
    plasticUsed: Boolean,
    co2Presence: Boolean,
    estimatedCO2: Number, // kg CO2e
    imageUrl: String,
});

module.exports = mongoose.model("Item", itemSchema);
