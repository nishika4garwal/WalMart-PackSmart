const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
// Add new employee
router.post("/add", async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all employees
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/login",async (req,res) =>{
    console.log("Login request received");
    const {email,password} = req.body;
    console.log("Login attempt with email:", email);
    try {
        const employee = await Employee.findOne({email});
        console.log("Employee found:", employee);
        if (!employee)
        {
            return res.status(404).json({message: "Employee not found"});
        }
        if (employee.passwordHash !== password) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token= jwt.sign(
            {eid: employee.eid,email: employee.email},
            JWT_SECRET,
        {
            expiresIn: "1h"
        });
        res.status(200).json({
            token,
            employee:{
                eid: employee.eid,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
            }
        });
    }
    catch (err)
    {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
})

module.exports = router;
