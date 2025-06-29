const express = require("express");
const router = express.Router();
const Label = require("../models/Label");

// Add new label
router.post("/add", async (req, res) => {
    try {
        const newLabel = new Label(req.body);
        const savedLabel = await newLabel.save();
        res.status(201).json(savedLabel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all labels
router.get("/", async (req, res) => {
    try {
        const labels = await Label.find();
        res.json(labels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
