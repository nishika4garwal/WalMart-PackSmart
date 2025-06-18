const express = require("express");
const router = express.Router();
const Box = require("../models/Box");

// Add new box
router.post("/add", async (req, res) => {
    try {
        const newBox = new Box(req.body);
        const savedBox = await newBox.save();
        res.status(201).json(savedBox);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all boxes
router.get("/", async (req, res) => {
    try {
        const boxes = await Box.find();
        res.json(boxes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
