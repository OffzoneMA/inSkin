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
      required: true,
    },
    images: [
      {
        data: Buffer,
        contentType: String
      },
    ],
    productDetails: {
      // Define your product details schema here
      // Example:
      name: {
          type: String,
      },
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        default: null, // Set default value to null
      },
      description: {
        type: String,
      },
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
    dislikelike: {
      type: Number,
    },
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
          required: true,
        },
        like: {
          type: Number,
          enum: [1, -1, 0], // 1 pour "like", -1 pour "dislike", 0 pour annuler
          required: true,
        },
        
      },
    ],
    dislikes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
          required: true,
        },
        dislike: {
          type: Number,
        },
        
      },
    ],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
      },
      text: {
        type: String,
        /*
        required: function() {
          return !this.review; // Comment is required if review is not provided
        },
        */
      },
      review: {
        type: Number,
        /*
        required: function() {
          return !this.text; // Review is required if comment is not provided
        },
        */
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    barcode: Joi.string().required(),
    userId: Joi.string().hex().length(24).required(), // Assuming userId is required
    images: Joi.array().items(
      Joi.object({
          data: Joi.binary().required(),
          contentType: Joi.string().required(),
      })
    ),

    productDetails: Joi.object({
      name: Joi.string().allow(''),
      brand: Joi.string().hex().length(24).allow(null),
      description: Joi.string().allow(''),
    }),

    comments: Joi.array().items(
      Joi.object({
        userId: Joi.string().hex().length(24).required(), // You can validate the user ID here
        text: Joi.string()/* .required() */,
        review: Joi.number().integer()/* .required() */,
      })
    ),
  });

  return schema.validate(product);
}
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Référence au modèle User
    required: true,
  },
  messageText: {
    type: String,
    required: true,
  },
  isPost: {
    type: Boolean,
    default: false, 
  },
  isFollowing: {
    type: Boolean,
    default: false,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Référence au modèle Product
    default: null, // Référence au produit si applicable
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

function validateNotification(notification) {
  const schema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    messageText: Joi.string().required(),
    isPost: Joi.boolean(),
    postId: Joi.string().hex().length(24).allow(null),
    date: Joi.date(),
  });

  return schema.validate(notification);
}

exports.Notification = Notification;
exports.Product = Product;
exports.validate = validateProduct;