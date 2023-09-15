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
      images: ["image_url_1", "image_url_2"], // Replace with image URLs
      productDetails: {
        name: req.body.name,
        brands: req.body.brands,
        categories: req.body.categories,
        ingredients: req.body.ingredients,
      },
      comments: [
        {
          userId: mongoose.Types.ObjectId("64f7549f9991cb2f7cfa6b0f"), // Replace with the actual user ID
          text: "This is a comment",
        },
      ],
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
