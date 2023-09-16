const express = require("express");
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");
const { Product/* , validate */ } = require("./models/product");

const router = express.Router();

const mongoose = require("mongoose");

// POST a new product
router.post(
  "/add-product",
  /* auth, */ // Ensure user is authenticated
  asyncMiddleware(async (req, res) => {
    // Validate the incoming request data
    /* const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    } */

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
      //userId: req.user._id, // Use the authenticated user's ID
      //images: req.body.images,
      //productDetails: req.body.productDetails,
    });

    // Save the product to the database
    await product.save();

    return res.status(201).json({ message: "Product posted successfully" });
  })
);

module.exports = router;
