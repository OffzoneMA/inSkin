const express = require("express");
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");
const { Product , validate } = require("./models/product");

const router = express.Router();

const mongoose = require("mongoose");

const Tea = require("./models/tea");
const multer = require("multer");

const bodyParser = require('body-parser');

router.use(bodyParser.json());

const upload = multer();

// POST a new product
router.post(
  "/add-product",
  /* auth, */ // Ensure user is authenticated
  upload.array('images'),
  asyncMiddleware(async (req, res) => {
    // Validate the incoming request data
    const { error } = validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const foundProduct = await Product.findOne({
      barcode: req.body.barcode,
    });

    if (foundProduct) {
      res.status(400).send("A product already exist with this barcode!");
      return;
    }

    const images = req.files.map(file => {
      return {
        data: file.buffer, // Buffer of the image file
        contentType: file.mimetype, // ContentType of the image (e.g., 'image/png')
      };
    })

    console.log(images)

    // Create a new product instance
    const product = new Product({
      barcode: req.body.barcode,
      userId: mongoose.Types.ObjectId(req.body.userId),
      images: images, // Replace with image URLs
      productDetails: req.body.productDetails,
      comments: req.body.comments,
    });

    // Save the product to the database
    await product.save();

    return res.status(201).json({ message: "Product posted successfully" });
  })
);

// GET all products
router.get("/", async (req, res) => {
  try {
    // Query the database to get all products
    const products = await Product.find();

    // Check if there are no products
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Return the products as JSON response
    res.status(200).json({ message: "Products retrieved successfully", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Query the database to find a product by ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product as JSON response
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//POST tea
const newTea = (req, res) => {

  //check if tea already exists in db
  Tea.findOne({ name: req.body.name }, (err, data) => {
    //if tea not in db, add it
    if (!data) {
      const newTea = new Tea({
        name: req.body.name,
        image: {
          data: req.file.buffer,
          contentType: req.file.buffer.mimetype
        },
        description: req.body.description,
        keywords: req.body.keywords,
        origin: req.body.origin,
        brew_time: req.body.brew_time,
        temperature: req.body.temperature,
      });

      //save to database
      newTea.save((err, data) => {
        if (err) {
          return res.json(`Error occurred while saving tea: ${err}`);
        }
        return res.json({message: "New tea is created.", data});
      });
      
    } else {
      if(err) return res.json(`Something went wrong, when cheking data. ${err}`);
      return res.json(`${req.body.name} tea already exists.`);
    }
  });
};

router.post(
  "/tea",
  upload.single('image'),
  newTea
);

// GET method to retrieve all posted images
const getAllTeaImages = (req, res) => {
  // Find all teas in the database
  Tea.find({}, (err, teas) => {
    if (err) {
      // Handle errors
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Extract image data from each tea and create an array of image objects
    const imageArray = teas.map((tea) => ({
      name: tea.name,
      contentType: tea.image.contentType,
      data: tea.image.data,
    }));

    // Send the array of image objects as a response
    res.json(imageArray);
  });
};

// Add this route to your Express router
router.get("/tea/images", getAllTeaImages);

module.exports = router;
