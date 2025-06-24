const express = require("express");
const router = express.Router();
const Box = require("../models/Box");
const axios = require("axios");

router.post("/add", async (req, res) => {
  try {
    const newBox = new Box(req.body);
    const savedBox = await newBox.save();
    res.status(201).json(savedBox);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/predict", async (req, res) => {
  try {
    const items = req.body.items;

    let total_weight = 0;
    let total_volume = 0;
    let total_quantity = 0;
    let combined_length = 0;
    let combined_width = 0;
    let combined_height = 0;
    let total_layers = 0;

    for (const item of items) {
      const { dimensions, weight, quantity, approxNoOfLayers } = item;
      const { length, width, height } = dimensions;

      const buf = 1 + 0.05 * (approxNoOfLayers || 0);
      const volume_per_item = length * width * height * buf;
      const item_total_volume = volume_per_item * quantity;
      const item_total_weight = weight * quantity;

      total_volume += item_total_volume;
      total_weight += item_total_weight;
      total_quantity += quantity;
      total_layers += approxNoOfLayers || 0;

      combined_length = Math.max(combined_length, length);
      combined_width = Math.max(combined_width, width);
      combined_height = Math.max(combined_height, height);
    }

    const density = total_weight / total_volume;

    const features = {
      length: combined_length,
      width: combined_width,
      height: combined_height,
      weight: total_weight / total_quantity,
      quantity: total_quantity,
      layers: Math.round(total_layers / items.length),
      volume_per_item: total_volume / total_quantity,
      total_volume: total_volume,
      total_weight: total_weight,
      density: density,
    };

    const response = await axios.post(`${process.env.ML_URL}/predict`, features);
    const { length, width, height, max_weight } = response.data;

    const allBoxes = await Box.find({});

    if (!allBoxes.length) {
      return res.status(404).json({ error: "No boxes found in DB" });
    }

    let bestBox = allBoxes[0];
    let bestScore = Infinity;

    for (const b of allBoxes) {
      const score =
        Math.abs(b.length - length) +
        Math.abs(b.width - width) +
        Math.abs(b.height - height) +
        Math.abs(b.maxWeightSupport - max_weight);

      if (score < bestScore) {
        bestScore = score;
        bestBox = b;
      }
    }

    res.json({
      boxId: bestBox.boxId,
      length: bestBox.length,
      width: bestBox.width,
      height: bestBox.height,
      volume: bestBox.length * bestBox.width * bestBox.height,
      maxWeightSupport: bestBox.maxWeightSupport,
      materialType: bestBox.materialType,
      co2Footprint: bestBox.co2Footprint,
      reusable: bestBox.reusable,
      madeOfRecycledMaterial: bestBox.madeOfRecycledMaterial,
    });

  } catch (error) {
    console.error("Prediction error:", error.message);
    res.status(500).json({ error: "Failed to predict best box" });
  }
});

router.post("/best", async (req, res) => {
  try {
    const { currentBoxId } = req.body;

    if (typeof currentBoxId !== "number") {
      return res.status(400).json({ error: "currentBoxId must be a number" });
    }

    const nextBox = await Box.findOne({ boxId: currentBoxId + 1 });

    if (!nextBox) {
      return res.status(404).json({ error: "Next best box not found" });
    }

    res.json({
      boxId: nextBox.boxId,
      length: nextBox.length,
      width: nextBox.width,
      height: nextBox.height,
      volume: nextBox.length * nextBox.width * nextBox.height,
      maxWeightSupport: nextBox.maxWeightSupport,
      materialType: nextBox.materialType,
      co2Footprint: nextBox.co2Footprint,
      reusable: nextBox.reusable,
      madeOfRecycledMaterial: nextBox.madeOfRecycledMaterial,
    });
  } catch (error) {
    console.error("Error in /boxes/best:", error.message);
    res.status(500).json({ error: "Failed to retrieve next best box" });
  }
});

router.get("/:boxId", async (req, res) => {
  try {
    const boxId = parseInt(req.params.boxId);
    if (isNaN(boxId)) {
      return res.status(400).json({ message: "Invalid boxId" });
    }

    const box = await Box.findOne({ boxId });
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    res.json({
      boxId: box.boxId,
      length: box.length,
      width: box.width,
      height: box.height,
      volume: box.length * box.width * box.height,
      maxWeightSupport: box.maxWeightSupport,
      materialType: box.materialType,
      co2Footprint: box.co2Footprint,
      reusable: box.reusable,
      madeOfRecycledMaterial: box.madeOfRecycledMaterial,
    });
  } catch (err) {
    console.error("Error fetching box:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
