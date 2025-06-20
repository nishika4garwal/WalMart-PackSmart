const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Add new item
router.post("/add", async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all items
router.get("/", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Route: GET /api/items/:itemId
router.get('/:itemId', async (req, res) => {
    try {
        const item = await Item.findOne({ itemId: req.params.itemId });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        console.error('Error fetching item:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
