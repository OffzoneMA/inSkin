const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
    barcode: {
        type: String, // You can store barcode information here
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        //required: true,
    },
    images: [
        {
        type: String, // You can store image URLs here
        },
    ],
    productDetails: {
        // Define your product details schema here
        // Example:
        name: {
            type: String,
        },
        brands: [
            {
            type: String, // You can store image URLs here
            },
        ],
        categories: [
            {
            type: String, // You can store image URLs here
            },
        ],
        ingredients: [
            {
            type: String, // You can store image URLs here
            },
        ],
    },
  createdAt:
    {
        type: Date,
        default: Date.now
    },
  updatedAt:
    {
        type: Date,
        default: Date.now
    },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
      text: {
        type: String,
      },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    barcode: Joi.string(),
    userId: Joi.string(), // You can validate the user ID here
    images: Joi.array().items(Joi.string()),
    productDetails: Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
    }),
    comments: Joi.array().items(
      Joi.object({
        userId: Joi.string(), // You can validate the user ID here
        text: Joi.string(),
      })
    ),
  });

  return schema.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;