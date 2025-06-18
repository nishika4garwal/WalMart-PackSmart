const express = require("express");
const router = express.Router();
const Material = require("../models/Material");

// Add new material
router.post("/add", async (req, res) => {
    try {
        const newMaterial = new Material(req.body);
        const savedMaterial = await newMaterial.save();
        res.status(201).json(savedMaterial);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all materials
router.get("/", async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
