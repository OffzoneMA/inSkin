const mongoose = require("mongoose");
const { User } = require("../api/auth/models/user");
const { Product } = require("../api/products/models/product");
const { Brand } = require("../api/brands/models/brand");
const fs = require('fs').promises;
const { resolve } = require('path');
const bcrypt = require("bcrypt");
const { faker } = require('@faker-js/faker');
const axios = require('axios');

async function getImageBufferFromURL(imageURL) {
    try {
        const response = await axios.get(imageURL, {
            responseType: 'arraybuffer'
        });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Error fetching and converting image:', error);
        throw error;
    }
}

async function createUsers() {
    // Create users if the collection is empty
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
        const unhashedPasswords = [];

        const user1Password = faker.internet.password();
        const user2Password = faker.internet.password();
        unhashedPasswords.push(user1Password, user2Password);
        const user1ProfileImage = await getImageBufferFromURL(await faker.image.avatar());
        const user2ProfileImage = await getImageBufferFromURL(await faker.image.avatar());
        const users = await User.create([
            {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                userName: faker.internet.userName(),
                email: faker.internet.email(),
                password: await bcrypt.hash(user1Password, 10),
                profileImage: { data: user1ProfileImage, contentType: "image/jpg" }
            },
            {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                userName: faker.internet.userName(),
                email: faker.internet.email(),
                password: await bcrypt.hash(user2Password, 10),
                profileImage: { data: user2ProfileImage, contentType: "image/jpg" }
            }
        ]);

        return { users, unhashedPasswords };
    }
    return [];
}

async function createBrands() {

    const imageFilePath1 = '../img/lrp.png';
    const imageData1 = await fs.readFile(resolve(__dirname, imageFilePath1));
    const imageBuffer1 = Buffer.from(imageData1);
    const contentType1 = imageFilePath1.split('/').pop().split('.').pop();

    const imageFilePath2 = '../img/nivea.jpg';
    const imageData2 = await fs.readFile(resolve(__dirname, imageFilePath2));
    const imageBuffer2 = Buffer.from(imageData2);
    const contentType2 = imageFilePath2.split('/').pop().split('.').pop();

    // Create brands if the collection is empty
    const brandsCount = await Brand.countDocuments();
    if (brandsCount === 0) {
        const brandPromises = [
            Brand.create({ name: "La Roche Posay", image: { data: imageBuffer1, contentType: contentType1 } }),
            Brand.create({ name: "Nivea", image: { data: imageBuffer2, contentType: contentType2 }  })
        ];

        return Promise.all(brandPromises);
    }
    return [];
}

async function createProducts(users, brands) {
    const imageFilePath1 = '../img/nivea-men-creme-front.jpg';
    const imageData1 = await fs.readFile(resolve(__dirname, imageFilePath1));
    const imageBuffer1 = Buffer.from(imageData1);
    const contentType1 = imageFilePath1.split('/').pop().split('.').pop();

    const imageFilePath2 = '../img/nivea-men-creme-barcode.png';
    const imageData2 = await fs.readFile(resolve(__dirname, imageFilePath2));
    const imageBuffer2 = Buffer.from(imageData2);
    const contentType2 = imageFilePath2.split('/').pop().split('.').pop();

    // Create products if the collection is empty
    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
        return Product.create([
            {
                barcode: "30070349",
                userId: users[0]._id,
                productDetails: {
                    name: "nutritic lip balm",
                    brand: brands[0]._id,
                },
                comments: [
                    { userId: users[0]._id, text: "Awesome !", review: 5 },
                    { userId: users[1]._id, text: "Not bad", review: 3 },
                ],
            },
            {
                barcode: "4005900115775",
                userId: users[1]._id,
                productDetails: {
                    name: "nivea men creme",
                    brand: brands[1]._id,
                },
                comments: [
                    { userId: users[1]._id, text: "Average !", review: 2 },
                    { userId: users[0]._id, text: "Pretty Good", review: 3.5 },
                ],
                images: [
                    { data: imageBuffer1, contentType: contentType1 },
                    { data: imageBuffer2, contentType: contentType2 },
                ],
            }
            // Add more products as needed
        ]);
    }
    return [];
}

module.exports = async function () {
    try {
        const { users, unhashedPasswords } = await createUsers(); // Destructure the returned object
        
        if (!users || users.length === 0) {
            console.log("Can't create mock users, users collection isn't empty");
        } else {
            console.log(`${users.length} users created successfully.`);
            users.forEach((user, i) => {
                // Print unhashed passwords from the unhashedPasswords array
                console.log(`User ${i}: Email: ${user.email}, Password: ${unhashedPasswords[i]}`);
            });
        }
        
        const brands = await createBrands();
        if (!brands || brands.length === 0) {
            console.log("Can't create mock brands, brands collection isn't empty");
        } else {
            console.log(`${brands.length} brands created successfully.`);
        }
        
        if (!users || users.length === 0 && !brands || brands.length === 0) {
            console.log("Can't create mock products if mock brands or mock users aren't created");
        } else {
            const products = await createProducts(users, brands);
            if (!products || products.length === 0) {
                console.log("Can't create mock products if products collection isn't empty")
            } else {
                console.log(`${products.length} products created successfully.`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

