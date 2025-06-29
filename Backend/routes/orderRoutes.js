const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST /api/orders/add → Add new order
router.post("/add", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders → View all orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const generateOrderId = () => {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase(); // e.g., X7Q2
    return `ORD-${timestamp}-${randomSuffix}`;
};

const getFeedback = (score) => {
    if (score >= 100) return '🎉 Yay! You contributed to the Earth!';
    if (score >= 50) return '🌱 Good effort, but there\'s room to grow!';
    return '⚠️ Oh no! Try better next time!';
};

router.post("/storeOrder", async (req, res) => {
    try {
        const { box, items, employeeId } = req.body;
        const parsedBox = typeof box === "string" ? JSON.parse(box) : box;

        // 1. Total CO2
        const totalCO2Score = (parsedBox.co2Footprint || 0) + items.reduce(
            (sum, item) => sum + (item.estimatedCO2 || 0) * (item.quantity || 1),
            0
        );

        // 2. Recyclability
        const recyclabilityScore = (parsedBox.madeOfRecycledMaterial === "yes" ? 10 : -3) +
            items.reduce((sum, item) => sum + (item.recyclable ? 15 : -5) * (item.quantity || 1), 0);

        // 3. Biodegradability
        const biodegradabilityScore = (parsedBox.reusable === "yes" ? 10 : -2) +
            items.reduce((sum, item) => sum + (item.biodegradable ? 10 : -3) * (item.quantity || 1), 0);

        // 4. Plastic Penalty
        const plasticPenalty = (parsedBox.materialType === "Plastic" ? -5 : 0) +
            items.reduce((sum, item) => sum + (item.plasticUsed ? -7 : 0) * (item.quantity || 1), 0);

        // 5. Final score (clamped between 0 and 100)
        const rawScore =
            (100 - totalCO2Score) * 0.5 +
            recyclabilityScore * 0.2 +
            biodegradabilityScore * 0.2 -
            plasticPenalty * 0.1;

        const finalSustainabilityScore = Math.max(0, Math.min(100, Math.round(rawScore)));

        // 6. Recyclable % (based on quantity)
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        const recyclableQty = items.reduce((sum, item) => sum + (item.recyclable ? item.quantity : 0), 0);
        const recyclablePercentage = Math.round((recyclableQty / totalQty) * 100);
        const nonRecyclablePercentage = 100 - recyclablePercentage;

        // 7. Price & plastic count
        const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        const totalPlasticUsed = items.reduce((sum, item) => sum + (item.plasticUsed ? item.quantity : 0), 0);

        // 8. Summary data
        const materialsUsed = Array.from(
            new Set(items.flatMap(item => item.layerMaterials || []))
        );

        const labelsApplied = Array.from(
            new Set(items.flatMap(item => item.tags || []))
        );


        // 9. Order doc
        const order = new Order({
            pid: generateOrderId(),
            employeeId: employeeId,
            itemIds: items.map(item => item.itemId),
            boxId: parsedBox.boxId,
            materialsUsed,
            labelsApplied,
            totalPlasticUsed,
            estimatedCO2Emitted: totalCO2Score,
            recyclablePercentage,
            nonRecyclablePercentage,
            sustainabilityScore: finalSustainabilityScore,
            ecoRecommendation: getFeedback(finalSustainabilityScore),
            totalPrice,
            createdAt: new Date()
        });


        await order.save();

        res.status(201).json({ message: "Order stored successfully", order });

    } catch (err) {
        console.error("Error storing order:", err);
        res.status(500).json({ message: "Failed to store order", error: err.message });
    }
});

module.exports = router;
