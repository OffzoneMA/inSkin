const mongoose = require("mongoose");
const Joi = require("joi");

const brandSchema = new mongoose.Schema({
    name: 
        { 
            type: String, 
            required: true 
        },
    image:
        {
            data: Buffer,
            contentType: String
        }
});

const Brand = mongoose.model("Brand", brandSchema);

function validateBrand(brand) {
  const schema = Joi.object({
    name: Joi.string().required(),
    image: Joi.object({
      data: Joi.binary().required(),
      contentType: Joi.string().required(),
    }),
  });

  return schema.validate(brand);
}

exports.Brand = Brand;
exports.validate = validateBrand;
