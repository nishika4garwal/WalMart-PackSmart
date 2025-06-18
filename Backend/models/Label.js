const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    icon: {
        type: String,
        required: true,
    },
    autoApplyTags: [String],
});

module.exports = mongoose.model("Label", labelSchema);
