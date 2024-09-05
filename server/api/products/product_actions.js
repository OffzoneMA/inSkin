const express = require("express");
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");
const { Product , validate, Notification } = require("./models/product");
const { User } = require("../auth/models/user");
//const Notification = require("../notifications/models/notifications")
const router = express.Router();

const mongoose = require("mongoose");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const bodyParser = require('body-parser');

router.use(bodyParser.json());


// const upload = multer();

// Debug middleware to log incoming requests
router.use((req, res, next) => {
  console.log('Request received: ', req.method, req.url);
  console.log('Request body: ', req.body);
  console.log('Request files: ', req.files);
  next();
});

// POST a new product
router.post(
  "/add-product3",
  auth, // Ensure user is authenticated
  upload.array('images'),
  asyncMiddleware(async (req, res) => {
    try {
      console.log('Inside POST /add-product2 handler');
      console.log('Files received: ', req.files);
      console.log('Request body: ', req.body);

      // Convert string fields to JSON objects
      req.body.productDetails = JSON.parse(req.body.productDetails);
      req.body.comments = JSON.parse(req.body.comments);

      // Validate the incoming request data
      const { error } = validate(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }

      // Check if a product with the same barcode already exists
      const foundProduct = await Product.findOne({ barcode: req.body.barcode });
      if (foundProduct) {
        return res.status(400).send("A product already exists with this barcode!");
      }

      // Ensure files are uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).send("No images uploaded.");
      }
      
   
      // Process the images
      const images = req.files.map(file => ({
        data: file.buffer, // Buffer of the image file
        contentType: file.mimetype, // ContentType of the image (e.g., 'image/png')
      }));

      // Create a new product instance
      const product = new Product({
        barcode: req.body.barcode,
        userId: mongoose.Types.ObjectId(req.body.userId),
        images: images, // Replace with image URLs if needed
        productDetails: req.body.productDetails,
        comments: req.body.comments,
      });

      // Save the product to the database
      await product.save();

      return res.status(201).json({ message: "Product posted successfully" });
    } catch (err) {
      console.error('Error during product creation:', err); // Log the error for debugging
      return res.status(500).send("Something failed.");
    }
  })
);


// POST a new product
router.post(
  "/add-product",
  auth, // Ensure user is authenticated
  upload.array('images'),
  asyncMiddleware(async (req, res) => {

    // Validate the incoming request data
    const { error } = validate(req.body);
    console.log(error);
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
    console.log("product",Product)
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
router.put(
  "/add-like",
  auth,
  asyncMiddleware(async (req, res) => {
    const productId = req.body._id; 
    const { userId, like } = req.body;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send("Product not found");
    }
    console.log("product avant ",product)

    // Vérifier si l'utilisateur a déjà "liké" ou "disliké" ce produit
    const existingLike = product.likes.find((l) => l.userId.toString() === userId);
    console.log("existingLike",existingLike)
    if (existingLike) {
      // Si l'utilisateur a déjà "liké" ou "disliké", mettre à jour son vote
      console.log("deja exste")
      existingLike.like = like;
    } else {
      console.log("on ajoute like")
      product.likes.push({ userId, like });
    }
     // Sauvegarder les changements
     await product.save();
    console.log("product",product)
    const liker = await User.findById(userId);
    console.log("liked produit",liker);
    if (!liker) {
      return res.status(404).send("User not found");
    }
    console.log("product.userId",product.userId);
    const author = await User.findById(product.userId);
    console.log("author",author);
    if (!author) {
      return res.status(404).send("Author not found");
    }
    if (author) {
      //const likingUser = await User.findById(userId);
      const message = `${liker.userName} aime votre publication '${product.productDetails.name}' `;
      const notification = new Notification({
        userId: product.userId, 
        messageText: message,
        isPost: true
      });
      console.log("notification",notification)
      await notification.save();

    }
   
   
    res.status(200).send({
      message: "Vote enregistré avec succès",
      product,
    });
  })
);

router.put(
  "/add-dislike",
  auth,
  asyncMiddleware(async (req, res) => {
    const productId = req.body._id; // Assuming you have the user ID in the request object
    const { userId, dislike } = req.body; // Assuming userId, text, and review are in the request body

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          dislikes: {
            userId: userId,
            dislike: dislike,
           
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
            favorites:"$user.favorites",
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

// router.get(
//   "/followed-products",
//   auth,
//   asyncMiddleware(async (req, res) => {
//     try {
//       const userId = req.user._id;
//       console.log("userId",userId);
   
//       const followedProducts = await Product.aggregate([
//         {
//           $lookup: {
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         {
//           $lookup: {
//             from: "users",
//             localField: "comments.userId",
//             foreignField: "_id",
//             as: "commentAuthors",
//           },
//         },
//         {
//           $match: {
//             "user.followers": userId,
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             productId: "$_id",
//             productName: "$productDetails.name",
//             productBrand: "$productDetails.brand",
//             productdescription: "$productDetails.description",
//             userId: 1,
//             userName: "$user.userName",
//             images: "$images",
//             createdAt:"$createdAt",
//             review:"$comments.review",
//             text:"$comments.text", // Inclure tous les commentaires associés à chaque produit
//             userNamecomm:"$commentAuthors.userName",
//             commentAuthors:"$commentAuthors",
//           },
//         },
//       ]);
//       console.log("commentAuthors",followedProducts.commentAuthors);
//      console.log("followedProducts",followedProducts)
//       res.json(followedProducts);
      
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   })
// );
router.get(
  "/followed-products",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id;
      console.log("userId", userId);

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
          $unwind: "$user", // Décomposer les documents d'utilisateur pour filtrage
        },
        {
          $match: {
            "user.followers": userId, // Filtrer les produits basés sur les utilisateurs suivis
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "comments.userId",
            foreignField: "_id",
            as: "commentAuthors",
          },
        },
        {
          $unwind: {
            path: "$comments",
            preserveNullAndEmptyArrays: true // Conserver les produits même s'ils n'ont pas de commentaires
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "comments.userId",
            foreignField: "_id",
            as: "commentAuthor",
          },
        },
        {
          $unwind: {
            path: "$commentAuthor",
            preserveNullAndEmptyArrays: true // Conserver les commentaires même si les auteurs ne sont pas trouvés
          }
        },
        {
          $sort: {
            "comments.review": -1, // Trier par note des commentaires (décroissante)
            "comments.createdAt": -1 // Trier par date de création des commentaires (décroissante)
          }
        },
        {
          $group: {
            _id: "$_id",
            productId: { $first: "$_id" },
            productName: { $first: "$productDetails.name" },
            productBrand: { $first: "$productDetails.brand" },
            productDescription: { $first: "$productDetails.description" },
            userId: { $first: "$userId" },
            userName: { $first: "$user.userName" },
            images: { $first: "$images" },
            createdAt: { $first: "$createdAt" },
            review: { $first: "$comments.review" }, // Conserver la note du commentaire
            text: { $first: "$comments.text" }, // Conserver le texte du commentaire
            userNameComm: { $first: "$commentAuthor.userName" }, // Nom de l'auteur du commentaire
            commentAuthors: { $first: "$commentAuthors" },
            profileImage: { $first: "$commentAuthor.profileImage" }, // Image de profil de l'auteur du commentaire
            commentCreatedAt: { $first: "$comments.createdAt" },
            userIdComm: { $first: "$commentAuthor._id" }
          },
        },
        {
          $project: {
            _id: 0,
            productId: 1,
            productName: 1,
            productBrand: 1,
            productDescription: 1,
            userId: 1,
            userName: 1,
            images: 1,
            createdAt: 1,
            review: 1,
            text: 1,
            userNameComm: 1,
            commentAuthors: 1,
            profileImage: 1,
            commentCreatedAt: 1,
            userIdComm:1
          },
        },
      ]);

      console.log("followedProducts", followedProducts);
      res.json(followedProducts);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/favorite-products",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id;
  console.log("userId",userId);
      const favoriteProducts = await User.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(userId) }
        },
        {
          $unwind: "$favorites" // Décompose le tableau des favoris en documents distincts
        },
        {
          $lookup: {
            from: "products", // Nom de la collection des produits
            localField: "favorites.productId",
            foreignField: "_id",
            as: "favoriteProduct"
          }
        },
        {
          $unwind: "$favoriteProduct" // Décompose le tableau des produits favoris en documents distincts
        },
        {
          $project: {
            _id: 0,
            productId: "$favoriteProduct._id",
            productName: "$favoriteProduct.name",
            productBrand: "$favoriteProduct.brand",
            productDescription: "$favoriteProduct.description",
            images: "$favoriteProduct.images",
            category: "$favorites.category",
          }
        }
      ]);

      res.json(favoriteProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);
router.get(
  "/my-products",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id; // ID de l'utilisateur connecté

      // Agrégation pour récupérer les produits publiés par l'utilisateur connecté
      const publishedProducts = await Product.aggregate([
        {
          $match: {
            userId: userId, // Filtrer les produits publiés par l'utilisateur connecté
          },
        },
        {
          $lookup: {
            from: "users", // Nom de la collection des utilisateurs
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user", // Décomposer le tableau pour avoir un seul objet utilisateur
        },
        {
          $lookup: {
            from: "comments", // Nom de la collection des commentaires
            localField: "_id", // Champ de correspondance dans le produit
            foreignField: "productId", // Correspond à "productId" dans les commentaires
            as: "comments",
          },
        },
        {
          $project: {
            productId: "$_id",
            productName: "$productDetails.name",
            productBrand: "$productDetails.brand",
            productDescription: "$productDetails.description",
            userId: "$user._id", // Informations sur l'utilisateur
            userName: "$user.name", // Nom de l'utilisateur
            images: "$images",
            createdAt: "$createdAt",
            comments: {
              // Extraire les informations des commentaires
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  text: "$$comment.text",
                  review: "$$comment.review",
                  createdAt: "$$comment.createdAt",
                },
              },
            },
          },
        },
      ]);
     console.log("publishedProducts",publishedProducts);
      res.json(publishedProducts); // Retourner les produits publiés avec leurs détails
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  })
);
router.get("/notifications",auth, async (req, res) => {
  try {
    const userId = req.user._id; // ID de l'utilisateur connecté, obtenu via le middleware d'authentification

    // Rechercher les notifications pour cet utilisateur
    const notifications = await Notification.find({ userId }).sort({ date: -1 });

    if (!notifications || notifications.length === 0) {
      return res.status(404).send("Aucune notification trouvée.");
    }

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Erreur lors de la récupération des notifications :", err);
    res.status(500).send("Erreur serveur.");
  }
});


// GET products by the connected user
router.get(
  "/my-products1",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      // Query the database to get products of the connected user
      const products = await Product.find({ userId: req.user.id });
      console.log("products",products);
      // Check if there are no products
      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found for the current user" });
      }
      const newProductsArray = products.map(product => ({
        productId: product._id,
        productName: product.productDetails.name,
        productBrand: product.productDetails.brand,
        createdAt: product.createdAt,
        text:  product.comments.text,
        review:  product.comments.review,
        comments: product.comments, // Inclure les commentaires si nécessaire
        images: product.images // Inclure les images si nécessaire
      }));
      console.log("newProductsArray",newProductsArray)
      // Return the products as JSON response
      res.json({newProductsArray});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
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
