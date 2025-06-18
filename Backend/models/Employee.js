const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    eid: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    joiningDate: {
        type: Date,
        required: true,
    },
    address: {
        type: String,
    },
});

module.exports = mongoose.model("Employee", employeeSchema);
