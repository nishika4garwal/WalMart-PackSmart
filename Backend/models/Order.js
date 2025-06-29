const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    pid: {
        type: String,
        required: true,
        unique: true,
    },
    employeeId: {
        type: String,
        required: true,
    },
    itemIds: [
        {
            type: Number,
            required: true,
        },
    ],
    boxId: {
        type: Number,
        required: true,
    },
    materialsUsed: [
        {
            type: String,
        },
    ],
    labelsApplied: [
        {
            type: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    totalPlasticUsed: {
        type: Number,
        default: 0,
    },
    estimatedCO2Emitted: {
        type: Number,
        default: 0,
    },
    recyclablePercentage: {
        type: Number,
        default: 0,
    },
    nonRecyclablePercentage: {
        type: Number,
        default: 0,
    },
    sustainabilityScore: {
        type: Number,
        default: 0,
    },
    ecoRecommendation: {
        type: String,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Order", orderSchema);
