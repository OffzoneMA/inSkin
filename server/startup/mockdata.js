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
  let user2Id;
  let brand1Id;

  // If collections are empty, create mock data
  if (usersCount === 0) {
    const users = await User.create([
      { firstName: "user1FirstName", lastName: "user1LastName", userName: "user1UserName", email: "user1@example.com", password: await bcrypt.hash("user1Password", 10) },
      { firstName: "user1FirstName", lastName: "user2LastName", userName: "user2UserName", email: "user2@example.com", password: await bcrypt.hash("user2Password", 10) },
    ]);

    // Get the userId of user1
    const foundUser1 = await User.findOne({email: "user1@example.com",}).select({ _id: 1 });
    user1Id = foundUser1._id;
    const foundUser2 = await User.findOne({email: "user2@example.com",}).select({ _id: 1 });
    user2Id = foundUser2._id
    console.log("Mock users created.");

    if (brandsCount === 0) {
        // Create an array of brand creation promises
        const brandCreationPromises = [
            Brand.create({ name: "La Roche Posay", image: { data: imageBuffer, contentType: "image/png" } }),
            Brand.create({ name: "Brand 2" })
        ];
    
        // Wait for all brand creation promises to resolve
        await Promise.all(brandCreationPromises);
    
        // Find "Brand 1" after all brands have been created
        const foundBrand = await Brand.findOne({ name: "La Roche Posay" }).select({ _id: 1 });
    
        // Ensure that foundBrand is not null before accessing its _id property
        if (foundBrand) {
            brand1Id = foundBrand._id;
            console.log("Mock brands created.");
        } else {
            console.log("Brand 1 not found.");
        }
    }    

    if (productsCount === 0) {
            await Product.create([
            {
                barcode: "30070349",
                userId: user1Id,
                productDetails: {
                name: "nutritic lip balm",
                brands: brand1Id,
                },
                comments: [
                { userId: user1Id, text: "Awesome !", review: 5 },
                { userId: user2Id, text: "Not bad", review: 2 },
                ],
            },
            // Add more products as needed
            ]);
            console.log("Mock products created.");
        }  
    }
};