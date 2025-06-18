const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    pid: {
        type: String,
        required: true,
        unique: true,
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    itemIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
        },
    ],
    boxId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Box",
        required: true,
    },
    materialsUsed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material",
        },
    ],
    labelsApplied: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Label",
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
