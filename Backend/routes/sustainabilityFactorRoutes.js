const express = require("express");
const router = express.Router();
const SustainabilityFactor = require("../models/SustainabilityFactor");

// Add new sustainability factor
router.post("/add", async (req, res) => {
    try {
        const newFactor = new SustainabilityFactor(req.body);
        const savedFactor = await newFactor.save();
        res.status(201).json(savedFactor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all sustainability factors
router.get("/", async (req, res) => {
    try {
        const factors = await SustainabilityFactor.find();
        res.json(factors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
