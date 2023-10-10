const express = require("express");
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");
const { Brand, validate } = require("./models/brand");

const router = express.Router();

const mongoose = require("mongoose");

const multer = require("multer");

const bodyParser = require('body-parser');

router.use(bodyParser.json());

const upload = multer();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// GET all products
router.get("/", async (req, res) => {
    try {
        // Query the database to get all products
        const brands = await Brand.find();
    
        // Check if there are no products
        if (!brands || brands.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
    
        // Return the products as JSON response
        res.status(200).json({ message: "Brands retrieved successfully", brands });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
  });



module.exports = router;
