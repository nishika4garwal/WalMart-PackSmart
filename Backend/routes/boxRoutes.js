const express = require("express");
const router = express.Router();
const Box = require("../models/Box");
const axios = require('axios');


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

// // Get all boxes
// router.get("/", async (req, res) => {
//     try {
//         const boxes = await Box.find();
//         res.json(boxes);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

let lastPredictedBox = null;

// ✅ POST /box/predict
router.post("/predict", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let totalVolume = 0;
    let totalWeight = 0;

    for (const item of items) {
      const quantity = item.quantity || 1;
      totalVolume += item.volume * quantity;
      totalWeight += item.weight * quantity;
    }

    // ✅ Send named features to ML model
    const mlResponse = await axios.post("http://localhost:5001/predict", {
      total_volume: totalVolume,
      total_weight: totalWeight,
    });

    const predictedBoxId = mlResponse.data.predicted_box;

    // ✅ Fetch the box from MongoDB
    const bestBox = await Box.findOne({ boxId: predictedBoxId });
    if (!bestBox) {
      return res.status(404).json({ message: "Box not found in database" });
    }

    lastPredictedBox = bestBox; // Save it for /best route
    res.json(bestBox);

  } catch (err) {
    console.error("Error in box prediction:", err.message || err);
    res.status(500).json({ message: "Internal server error during box prediction" });
  }
});

// ✅ GET /box/best
router.get('/best', (req, res) => {
  if (!lastPredictedBox) {
    return res.status(404).json({ message: "No prediction yet" });
  }
  res.json(lastPredictedBox);
});

// ✅ GET /box/:boxId
router.get('/:boxId', async (req, res) => {
  try {
    const boxId = parseInt(req.params.boxId);
    if (isNaN(boxId)) {
      return res.status(400).json({ message: "Invalid boxId" });
    }

    const box = await Box.findOne({ boxId });
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    res.json(box);
  } catch (err) {
    console.error('Error fetching box:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;