const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require('path');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Init express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Import Routes
const employeeRoutes = require("./routes/employeeRoutes");
const itemRoutes = require("./routes/itemRoutes");
const boxRoutes = require("./routes/boxRoutes");
const orderRoutes = require("./routes/orderRoutes");
const materialRoutes = require("./routes/materialRoutes");
const labelRoutes = require("./routes/labelRoutes");
const sustainabilityFactorRoutes = require("./routes/sustainabilityFactorRoutes");

// Serve images from /labels
app.use('/labels', express.static(path.join(__dirname, 'labels')));

// Use Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/boxes", boxRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/sustainability", sustainabilityFactorRoutes);


// Root route
app.get("/", (req, res) => {
    res.send("🌱 API running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
