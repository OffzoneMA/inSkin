const express = require("express");
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");
const { Product , validate } = require("./models/product");

const router = express.Router();

const mongoose = require("mongoose");

// POST a new product
router.post(
  "/add-product",
  auth, // Ensure user is authenticated
  asyncMiddleware(async (req, res) => {
    // Validate the incoming request data
    const { error } = validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const foundProduct = await Product.findOne({
      barcode: req.body.barcode,
    });

    if (foundProduct) {
      res.status(400).send("A product already exist with this barcode!");
      return;
    }

    // Create a new product instance
    const product = new Product({
      barcode: req.body.barcode,
      userId: mongoose.Types.ObjectId(req.body.userId),
      images: req.body.images, // Replace with image URLs
      productDetails: {
        name: req.body.productDetails.name,
        brands: req.body.productDetails.brands,
        categories: req.body.productDetails.categories,
        ingredients: req.body.productDetails.ingredients,
      },
      comments: req.body.comments,
    });

    // Save the product to the database
    await product.save();

    return res.status(201).json({ message: "Product posted successfully" });
  })
);

// GET all products
router.get("/", async (req, res) => {
  try {
    // Query the database to get all products
    const products = await Product.find();

    // Check if there are no products
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Return the products as JSON response
    res.status(200).json({ message: "Products retrieved successfully", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Query the database to find a product by ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product as JSON response
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
