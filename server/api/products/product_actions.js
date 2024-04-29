const express = require("express");
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");
const { Product , validate } = require("./models/product");

const router = express.Router();

const mongoose = require("mongoose");

const multer = require("multer");

const bodyParser = require('body-parser');

router.use(bodyParser.json());

const upload = multer();

// POST a new product
router.post(
  "/add-product",
  auth, // Ensure user is authenticated
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
router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
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
}));

// GET a single product by ID
router.get(
  "/get-product-byid/:id",
  auth,
  asyncMiddleware(async (req, res) => {
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
}));

// POST a new product
router.get(
  "/get-product-bybarcode/:barcode",
  auth, // Ensure user is authenticated
  asyncMiddleware(async (req, res) => {

    const foundProduct = await Product.findOne({
      barcode: req.params.barcode,
    });

    if (!foundProduct) {
      res.status(400).send("This product doesn't exist!");
      return;
    }

    // Return the product as JSON response
    res.status(200).json(foundProduct);
  })
);

// Route to update profile image
router.put(
  "/add-comment",
  auth,
  asyncMiddleware(async (req, res) => {
    const productId = req.body._id; // Assuming you have the user ID in the request object
    const { userId, text, review } = req.body; // Assuming userId, text, and review are in the request body

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          comments: {
            userId: userId,
            text: text,
            review: review,
            createdAt: new Date()
          }
        }
      },
      { new: true } // This option ensures that the updated document is returned
    );

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).send("Comment added successfully");
  })
);


// Add this route to your Express router
router.get(
  "/product-comments/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      // Find the product by ID in the database
      const product = await Product.findById(req.params.id);

      if (!product) {
        // If the product with the given ID doesn't exist, return 404 Not Found
        return res.status(404).json({ error: "Product not found" });
      }

      // Extract comments data from the product and send it as a response
      const comments = product.comments.map((comment) => ({
        _id: comment._id,
        userId: comment.userId,
        text: comment.text,
        review: comment.review,
        createdAt: comment.createdAt,
      }));

      // Send the array of comments as a response
      res.json(comments);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);
router.get(
  "/users-with-products",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const loggedInUserId = req.user.id;
      console.log("l id de l utilisateur connecte ",loggedInUserId);
      // Trouver tous les utilisateurs avec leurs produits associés
      const usersWithProducts = await Product.aggregate([
        {
          $group: {
            _id: "$userId", // Grouper par l'ID de l'utilisateur
            products: { $push: "$$ROOT" }, // Ajouter tous les produits de l'utilisateur à un tableau
          },
        },
        {
          $lookup: {
            from: "users", // Nom de la collection des utilisateurs
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user", // Désagréger le tableau d'utilisateurs
        },
        {
          $project: {
            _id: "$_id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            userName:"$user.userName",
            followers:"$user.followers",
            profileImage: "$user.profileImage",
            products: "$products", // Garder le tableau de produits
          },
        },
        {
          $unwind: "$products", // Désagréger le tableau de produits
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", "$products"] } } // Fusionner les informations des produits avec l'utilisateur
        },
        {
          $project: { products: 0 } // Supprimer le tableau de produits initial
        }
      ]);
      
       console.log("tableau de users with publication",usersWithProducts);
       // Filtrer les utilisateurs pour n'inclure que ceux qui ont des produits publiés mais qui ne sont pas suivis par l'utilisateur connecté actuel
       const unfollowedUsersWithProducts = usersWithProducts.filter(user => {
       
        const loggedInUserIdObj = mongoose.Types.ObjectId(loggedInUserId);
    
        
        const isNotFollowed = !user.followers.some(follower => follower.equals(loggedInUserIdObj));
          console.log("verifier si il le suivi ",isNotFollowed);
      
        return isNotFollowed;
    });
    console.log("unfollowedUsersWithProducts wiiamaa",unfollowedUsersWithProducts);
      // Envoyer la liste des utilisateurs filtrés en réponse
      res.json(unfollowedUsersWithProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/followed-products",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id;
   
      const followedProducts = await Product.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "productId",
            as: "comments",
          },
        },
        {
          $match: {
            "user.followers": userId,
          },
        },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            productName: "$productDetails.name",
            userId: 1,
            userName: "$user.userName",
            images: "$images",
            comments: 1, // Inclure tous les commentaires associés à chaque produit
          },
        },
      ]);
     
      res.json(followedProducts);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);



router.get(
  "/all-comments",
  auth,
  asyncMiddleware(async (req, res) => {
  try {
      const products = await Product.find().populate({
          path: 'comments.userId',
          select: 'userName profileImage', // Assuming the username is a field in your User model
      }).exec();

      if (!products || products.length === 0) {
          return res.json([]);
      }

      // Manually populate the username field inside the comments array
      let allComments = [];
      products.forEach(product => {
          product.comments.forEach(comment => {
              if (comment.userId && comment.userId.userName) {
                  const formattedComment = {
                      _id: comment._id,
                      productId: product._id,
                      productName: product.productDetails.name,
                      userId: comment.userId._id,
                      text: comment.text,
                      review: comment.review,
                      createdAt: comment.createdAt,
                      userName: comment.userId.userName, // Add the username field directly to the comment object
                      profileImage: comment.userId.profileImage
                  };
                  allComments.push(formattedComment);
              }
          });
      });

      // Send the array of comments as a response
      res.json(allComments);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}));


module.exports = router;
