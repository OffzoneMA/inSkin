const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const settings = require('../../../config/settings')

const postSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });


const userSchema = new mongoose.Schema({
  firstName: 
          { 
            type: String, 
            required: true 
          },
  lastName: 
          { 
            type: String 
          },
  email: 
        { 
          type: String,
          unique: true,
          required: true 
        },
  userName: 
          { 
            type: String,
            unique: true, 
            required: true
          },
  password: 
          { 
            type: String, 
            required: true 
          },
  profileImage:
        {
          data: Buffer,
          contentType: String
        },
  followers:  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  ],
  following:  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  ],
  isAdmin: 
        {
          type: Boolean,
          default: false
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
  lastLogin: 
        {
          type: Date,
          default: Date.now
        },
  signInCount:
        {
          type: Number,
          default: 1
        },
  posts: [postSchema] ,
  desactivatedAccount:
        {
          type: Boolean,
          default: false,
        },
  instagramLink:
        {
          type: String 
        },
  tiktokLink:
        {
          type: String 
        },
  favorites: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", // Référence au modèle Product
            required: false,
          },
        category: {
            type: String,
            required: true,
          },
        }],     
});


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      user: {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.userName,
        email: this.email,
      },
    },
    settings.jwtPrivateKey
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    email: Joi.string().email().required(),
    userName: Joi.string(),
    password: Joi.string()
      .min(4)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    profileImage: Joi.object({
      data: Joi.binary().required(),
      contentType: Joi.string().required(),
    }),
    isAdmin: Joi.boolean(),
    favorites: Joi.array().items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        category: Joi.string().required(),
      })
    ),
  });
  
  
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
