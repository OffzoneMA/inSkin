const mongoose = require("mongoose");
const { User } = require("../api/auth/models/user");
const { Product } = require("../api/products/models/product");
const { Brand } = require("../api/brands/models/brand");

const fs = require('fs');

const { resolve } = require('path');

const bcrypt = require("bcrypt");

module.exports = async function () {
    // Check if users, products, and brands collections are empty
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const brandsCount = await Brand.countDocuments();

  // Read image file and create a buffer
  const imageFilePath = '../img/brand-mockup-LRP.png'; // Replace with the actual path to your image file
  const imageData = fs.readFileSync(resolve(__dirname, imageFilePath));
  const imageBuffer = Buffer.from(imageData);

  let user1Id;
  let brand1Id;

  // If collections are empty, create mock data
  if (usersCount === 0) {
    const users = await User.create([
      { firstName: "user1FirstName", lastName: "user1LastName", userName: "user1UserName", email: "user1@example.com", password: await bcrypt.hash("user1Password", 10) },
      { firstName: "user1FirstName", lastName: "user2LastName", userName: "user2UserName", email: "user2@example.com", password: await bcrypt.hash("user2Password", 10) },
    ]);

    // Get the userId of user1
    const foundUser = await User.findOne({email: "user1@example.com",}).select({ _id: 1 });
    user1Id = foundUser._id;
    console.log("Mock users created.");

    if (brandsCount === 0) {
        const brands = await Brand.create([
            { name: "Brand 1", image: { data: imageBuffer, contentType: "image/png" } },
            { name: "Brand 2" },
        ]);

        const foundBrand = await Brand.findOne({name: "Brand 1",}).select({ _id: 1 });
        brand1Id = foundBrand._id;
        console.log("Mock brands created.");
    }

    if (productsCount === 0) {
            await Product.create([
            {
                barcode: "30070349",
                userId: user1Id,
                productDetails: {
                name: "Product 1",
                brand: brand1Id,
                categories: ["Category 1", "Category 2"],
                ingredients: ["Ingredient 1", "Ingredient 2"],
                },
                comments: [
                { userId: user1Id, text: "Comment 1" },
                { userId: user1Id, text: "Comment 2" },
                ],
            },
            // Add more products as needed
            ]);
            console.log("Mock products created.");
        }  
    }
};