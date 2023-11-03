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

// GET all brands
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

// GET a single brand by ID
router.get("/get-brand-byid/:id", async (req, res) => {
    try {
      const brandId = req.params.id;
  
      // Query the database to find a product by ID
      const brand = await Brand.findById(brandId);
  
      // Check if the product exists
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
  
      // Return the product as JSON response
      res.status(200).json(brand);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET multiple brands by IDs
router.get("/get-brands-byids", async (req, res) => {
    try {
        // Retrieve an array of brand IDs from the request query parameters
        const brandIds = req.query.ids.split(',');

        // Query the database to find brands by IDs
        const brands = await Brand.find({ _id: { $in: brandIds } });

        // Check if any brands exist
        if (brands.length === 0) {
            return res.status(404).json({ message: "No brands found for the provided IDs" });
        }

        // Return the brands as a JSON response
        res.status(200).json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;
