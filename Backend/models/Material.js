const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    recycledContent: {
        type: Number, // %
        default: 0,
    },
    recyclable: {
        type: Boolean,
        default: false,
    },
    biodegradable: {
        type: Boolean,
        default: false,
    },
    sustainable: {
        type: Boolean,
        default: false,
    },
    co2PerUnit: {
        type: Number, // kg CO2e
        required: true,
    },
});

module.exports = mongoose.model("Material", materialSchema);
