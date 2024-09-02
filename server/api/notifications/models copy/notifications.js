const mongoose = require("mongoose");
const Joi = require("joi");

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
    default: false, // Indique si la notification est liée à une publication
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
exports.validate = validateNotification;
