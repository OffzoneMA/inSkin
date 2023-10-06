const mongoose = require("mongoose");
const Joi = require("joi");

const brandSchema = new mongoose.Schema({
    brandName: 
        { 
            type: String, 
            required: true 
        },
    profileImage:
        {
            data: Buffer,
            contentType: String
        }
});

const Brand = mongoose.model("Brand", brandSchema);

function validateBrand(brand) {
  const schema = Joi.object({
    brandName: Joi.string().required(),
    profileImage: Joi.object({
      data: Joi.binary().required(),
      contentType: Joi.string().required(),
    }),
  });

  return schema.validate(brand);
}

exports.Brand = Brand;
exports.validate = validateBrand;
