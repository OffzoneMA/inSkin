const express = require("express");
const bcrypt = require("bcrypt");
const asyncMiddleware = require("../../middleware/async");
const { User, validate } = require("./models/user");
const PasswordReset = require("./models/PasswordReset");
const auth = require("../../middleware/auth");
const { Notification } = require("../products/models/product");
const passport= require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const session = require('express-session');
//const nodemailer= require('nodemailer')
const router = express.Router();
const multer = require("multer");
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const upload = multer();

const { faker } = require('@faker-js/faker');

const axios = require('axios');
const{v4:uuidv4}=require("uuid");
const { error } = require("winston");

///OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK
router.post(
  "/login",
  asyncMiddleware(async (req, res) => {
    // Find user with email
    const foundUser = await User.findOne({
      email: req.body.email,
    }).select({ firstName: 1, lastName: 1, userName: 1, email: 1, password: 1 });

    // User doesn't exist
    if (!foundUser) {
      res.status(400).send("User does not exist!");
      return;
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    if (!passwordMatch)
      res.status(400).send("Incorrect password! Please try again");

    // Update login count
    await User.findOneAndUpdate(
      { _id: foundUser._id },
      { $inc: { signInCount: 1 } },
    );

    const token = foundUser.generateAuthToken();
    res.header("bearer-token", token).json({ message: "Login Successful" });
  })
);

/// OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK

router.put('/change-password', auth, async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
    }

    return res.status(200).json({ success: true, message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la modification du mot de passe:", error);
    return res.status(500).json({ success: false, message: "Erreur lors de la modification du mot de passe." });
  }
});

////////////////////////

router.post(
  "/requestepasswordreset",
  asyncMiddleware(async (req, res) => {
    const {email, redirectUrl}= req.body;
    // Find user with email
    const foundUser = await User.findOne({email
    }).then((data)=>{
      if(data.length){
        if(!data[0].veified){
          res.status(400).send("Email hasn't verfied yet. check your inbox!");

        }else{
          sendResetEmail(data[0],redirectUrl,res);

        }
      }else{
        // User doesn't exist
        res.status(400).send("User does not exist!");
        return;
      }
    });
    const token = foundUser.generateAuthToken();
    res.header("bearer-token", token).json({ message: "Login Successful" });
  })
);
const sendResetEmail=({_id,email},redirectUrl,res)=>{
  const resetString= uuidv4 + _id;
PasswordReset
.deleteMany({userId: _id})
.then(result=>{
  const mailoptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Password Reset",
    html: `<p>Use the link below to reset it.</p> <p><a href="${redirectUrl}/${_id}/${resetString}">Here</a> to proceed.</p>`,
  };
  const saltRounds =10;
  bcrypt
  .hash(resetString, saltRounds)
  .then(hashedResetString=>{
    const newPasswordReset= new PasswordReset({userId:_id,
    resetString:hashedResetString,
    createddAt:Date.now(),
    expiresAt:Date.now() + 3600000
    });
    newPasswordReset
    .save()
    .then(()=>{
      // transporter
      // .sendMail(mailoptions)
      // .then(()=>{
      //   res.json({
      //     status:"pending",
      //     message:"password reset email sent"
      //   })
      // })
      // .catch(error=>{
      //   console.log(error);
      // })

    })
    .catch(error=>{
      console.log(error);
    })
  })
  .catch(error=>{
    console.log(error);
  })

  
})
.catch( error=>{
  console.log(error)
})

}

router.put(
  "/update-user-info",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.body._id;
      const foundUser = await User.findById(userId);
      if (!foundUser) {
        res.status(400).send("User does not exist!");
        return;
      }
      foundUser.firstName = req.body.firstName || foundUser.firstName;
      foundUser.lastName = req.body.lastName || foundUser.lastName;

      // Update password if provided
      if (req.body.newPassword) {
        const passwordMatch = await bcrypt.compare(
          req.body.currentPassword,
          foundUser.password
        );

        if (!passwordMatch) {
          res.status(400).send("Incorrect password! Please try again");
          return;
        }

        foundUser.password = await bcrypt.hash(req.body.newPassword, 10);
      }

      await foundUser.save();

      const token = foundUser.generateAuthToken();
      res.header("bearer-token", token).json({ message: "User information updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  })
);

/// OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK

router.post(
  '/compare-password',
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.body._id;
      const currentPassword = req.body.currentPassword;

      // Find user by ID
      const foundUser = await User.findById(userId);

      // User doesn't exist
      if (!foundUser) {
        return res.status(400).send('User does not exist!');
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(currentPassword, foundUser.password);

      if (!passwordMatch) {
        return res.status(400).send('Incorrect password! Please try again');
      }

      res.status(200).send('Password is correct');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  })
);

router.post(
  "/register",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    console.log("cmt 1")
    if (error) {
      console.log("cmt 2",error)
      res.status(400).send(error.details[0].message);
      return;
    }
    console.log("cmt 3")
    console.log("cmt 4")
    
    const foundUser = await User.findOne({
      email: req.body.email,

    });
    console.log("ncmt 5")
    if (foundUser) {
      res.status(400).send("A user is already registered with this email!");
      return;
    }
    console.log("cmt 6")
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("cmt 7")
    // Generate unique username
    var userName;
    while (true) {
      userName = req.body.firstName
        .concat(req.body.lastName)
        .concat(Math.floor(Math.random() * 10000).toString());

      const foundUser = await User.findOne({
        userName: userName,
      });

      if (!foundUser) {
        break;
      }
    }
    console.log("cmt 8")
    // Fetch image from the URL and convert it to a buffer
    const imageURL = faker.image.avatar(); 
    console.log("cmt 9")
    // Replace with the actual URL to your image
    //const imageBuffer = await getImageBufferFromURL(imageURL);
    console.log("cmt 10")
    console.log("cmt 11")
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: userName,
      email: req.body.email,
      password: hashedPassword,
      profileImage: {  // Include profile image data in newUser object
        //data: imageBuffer, // Assuming imageURL is a base64 encoded string
        contentType: 'image/jpg' // Set the content type accordingly
      }
    });

    console.log("cmt 12");
    await newUser.save();
    const token = newUser.generateAuthToken();
    console.log("Registration Successful!");
    res
      .header("bearer-token", token)
      .json({ message: "Registration Successful!" });
  })
);

router.get(
  "/status",
  auth,
  asyncMiddleware(async (req, res) => {
    res.status(200).send("OK");
  })
);


/// OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK

const mongoose = require('mongoose');

router.put(
  "/update-profile-image1",
  auth,
  upload.single('image'),
  asyncMiddleware(async (req, res) => {
    let userId;
    try {
      userId = JSON.parse(req.body._id); // Supprimer les guillemets doubles supplémentaires
    } catch (err) {
      return res.status(400).send("Invalid user ID format");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    if (!req.file) {
      return res.status(400).send("No image file provided");
    }

    console.log('File received:', req.file);
    console.log('User ID:', userId);

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            profileImage: {
              data: req.file.buffer,
              contentType: req.file.mimetype
            }
          }
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).send("Profile image updated successfully");
    } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).send("Error updating profile image");
    }
  })
);


/// OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK

router.put(
  "/update-profile-image2",
  auth,
  upload.single('image'),
  asyncMiddleware(async (req, res) => {
    let userId;

    try {
      userId = JSON.parse(req.body._id); // Supprimer les guillemets doubles supplémentaires
    } catch (err) {
      return res.status(400).send("Invalid user ID format");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    if (!req.file) {
      return res.status(400).send("No image file provided");
    }

    console.log('File received:', req.file);
    console.log('User ID:', userId);

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            profileImage: {
              data: req.file.buffer,
              contentType: req.file.mimetype
            }
          }
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).send("Profile image updated successfully");
    } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).send("Error updating profile image");
    }
  })
);
router.put(
  "/update-profile-image",
  auth, 
  upload.single('image'),
  asyncMiddleware(async (req, res) => {
    const userId = req.body._id; // Assuming you have the user ID in the request object
    console.log("user._id inserver",userId);
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          profileImage: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
        }
      },
      { new: true } // This option ensures that the updated document is returned
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("Profile image updated successfully");
  })
);

router.get(
  "/profile-image/:id",
  auth, // Ensure the user is authenticated to access this route
  asyncMiddleware(async (req, res) => {
    const userId = req.params.id; // Assuming you have the user ID in the request object after authentication
    const user = await User.findById(userId).select({ userName: 1 , profileImage: 1});

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.profileImage || !user.profileImage.data) {
      return res.status(404).send("Profile image not found");
    }

    const profileImage = {
      name: "profile_image_" + user.userName,
      contentType: user.profileImage.contentType,
      data: user.profileImage.data,
    }

    res.json(profileImage);
  })
);

// GET multiple users by IDs 
/// OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK
router.get(
  "/get-users-byids", 
  auth,
  asyncMiddleware(async (req, res) => {
  try {
      // Retrieve an array of brand IDs from the request query parameters
      const userIds = req.query.ids.split(',');

      // Query the database to find brands by IDs
      const users = await User.find({ _id: { $in: userIds } });

      // Check if any brands exist
      if (users.length === 0) {
          return res.status(404).json({ message: "No users found for the provided IDs" });
      }

      // Return the brands as a JSON response
      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}));

/// OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK
router.get(
  "/get-users-by-emails",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      // Retrieve an array of email addresses from the request query parameters
      const emails = req.query.emails.split(',');

      // Query the database to find users by email addresses
      const users = await User.find({ email: { $in: emails } });

      // Check if any users exist
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found for the provided email addresses" });
      }

      // Return the users as a JSON response
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })

);

///OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK
router.get(
  "/get-random-users", 
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const numberOfUsers = 5; // Nombre d'utilisateurs à retourner

      // Utiliser la méthode de MongoDB pour récupérer un échantillon aléatoire d'utilisateurs
      const users = await User.aggregate([ { $sample: { size: numberOfUsers } } ]);

      // Vérifier si des utilisateurs ont été trouvés
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      // Retourner les utilisateurs comme réponse JSON
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);
router.get(
  "/favorite-products",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id;
      console.log("userId", userId);

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
            images: "$favoriteProduct.images",
            category: "$favorites.category",
            createdAt: "$favoriteProduct.createdAt" // Assurez-vous que vous avez le champ createdAt
          }
        },
        {
          $sort: {
            category: 1, // Trier par catégorie pour le regroupement
            createdAt: -1 // Trier par date de création pour obtenir le produit le plus récent
          }
        },
        {
          $group: {
            _id: "$category", // Grouper par catégorie
            product: {
              $first: { // Obtenir le premier produit dans chaque groupe, c'est-à-dire le plus récent
                productId: "$productId",
                images: "$images",
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id", // Renommer _id en category
            productId: "$product.productId",
            images: "$product.images"
          }
        }
      ]);

      console.log("favoriteProducts", favoriteProducts);
      res.json(favoriteProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/allfavorite-products",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id;

      // Pipeline MongoDB simplifié
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
            _id: 0, // On peut également conserver l'id si besoin
            productId: "$favoriteProduct._id",
            productName: "$favoriteProduct.name",
            productBrand: "$favoriteProduct.brand",
            productDescription: "$favoriteProduct.description",
            images: "$favoriteProduct.images"
          }
        }
      ]);

      // Log des produits favoris pour vérification
      console.log("favoriteProducts", favoriteProducts);

      // Envoi de la réponse avec les produits favoris
      res.json(favoriteProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/favorite-products-by-category/:categoryName",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id;
      const { categoryName } = req.params; 

      // Étape 1: Trouver tous les produits favoris de l'utilisateur
      const favoriteProducts = await User.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(userId) }
        },
        
        {
          $unwind: "$favorites" // Décompose le tableau des favoris
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
          $unwind: "$favoriteProduct" // Décompose le tableau des produits favoris
        },
        {
          $match: { "favorites.category": categoryName } // Filtre par nom de catégorie
        },
        {
          $project: {
            _id: 0,
            productId: "$favoriteProduct._id",
            productName: "$favoriteProduct.productDetails.name",
            productBrand: "$favoriteProduct.brand",
            productDescription: "$favoriteProduct.description",
            images: "$favoriteProduct.images",
            category: "$favorites.category",
            createdAt:"$favoriteProduct.createdAt",
            // review: "$comments.review",
            comment: "$favoriteProduct.comments.review", // Projette le champ review des commentaires
            commentDate: "$favoriteProduct.comments.createdAt",
          }
        }
      ]);

      if (favoriteProducts.length === 0) {
        return res.status(404).json({ error: "No favorite products found for the specified category" });
      }

      console.log("Favorite Products by Category:", favoriteProducts);
      res.json(favoriteProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);





router.get(
  "/getCategories",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id;
      console.log("userId",userId);
      const user = await User.findById(userId);
      if (!user) {
        return { error: 'Utilisateur non trouvé.' };
      }
  
      // Récupérer toutes les catégories des favoris
      const categories = user.favorites.map(favorite => favorite.category);
  
      // Filtrer pour ne garder que les catégories uniques
      const uniqueCategories = [...new Set(categories)];
  
      return { categories: uniqueCategories };
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);
router.post(
  "/follow",
  auth, // Assurez-vous que l'utilisateur est authentifié pour accéder à cette route
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.user._id; // ID de l'utilisateur authentifié qui suit un autre utilisateur
      console.log("ID de l'utilisateur authentifié qui suit un autre utilisateur", userId)
      const userToFollowEmail = req.body.email; // Email de l'utilisateur à suivre
      console.log("Email de l'utilisateur à suivre :", userToFollowEmail)
      
      // Vérifiez si l'utilisateur à suivre existe
      const userToFollow = await User.findOne({ email: userToFollowEmail });
      console.log("L'utilisateur à suivre :", userToFollow);
      if (!userToFollow) {
        return res.status(404).json({ message: "User to follow not found" });
      }

      // Vérifiez si l'utilisateur authentifié suit déjà l'utilisateur à suivre
      if (userToFollow.followers.includes(userId)) {
        return res.status(400).json({ message: "You are already following this user" });
      }
      // Mettez à jour les tableaux de suiveurs et de suivis pour les deux utilisateurs
      await User.findByIdAndUpdate(userId, { $push: { following: userToFollow._id } });
      await User.findByIdAndUpdate(userToFollow._id, { $push: { followers: userId } });
      const follower = await User.findById(userId);
    console.log("liked produit",follower);
    if (!follower) {
      return res.status(404).send("User not found");
    }
    
    if (userToFollow) {
      //const likingUser = await User.findById(userId);
      const message = `${follower.userName} Commence à vous suivre `;
      const notification = new Notification({
        userId:userToFollow._id, 
        messageText: message,
        isFollowing: true
      });
      console.log("notification",notification)
      await notification.save();

    }
      res.status(200).json({ message: "User followed successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);


router.post(
  "/follow-user222", 
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const { targetUserId } = req.body; // ID de l'utilisateur cible à suivre
      const userId = req.user.id; // ID de l'utilisateur connecté (obtenu via le middleware auth)

      // Trouver l'utilisateur connecté et l'utilisateur cible
      const user = await User.findById(userId);
      const targetUser = await User.findById(targetUserId);

      if (!user || !targetUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Vérifier si l'utilisateur cible est déjà suivi
      if (user.following.includes(targetUserId)) {
        return res.status(400).json({ message: 'Utilisateur déjà suivi' });
      }

      // Ajouter l'utilisateur cible à la liste des suivis et
      // ajouter l'utilisateur connecté à la liste des suiveurs
      user.following.push(targetUserId);
      targetUser.followers.push(userId);

      // Sauvegarder les modifications
      await user.save();
      await targetUser.save();

      res.status(200).json({ message: 'Suivi réussi' });
    } catch (error) {
      console.error('Erreur lors du suivi:', error);
      res.status(500).json({ message: 'Erreur lors du suivi' });
    }
  })
);
router.post(
  "/follow-user", 
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const { targetUserId } = req.body; // ID de l'utilisateur cible à suivre
      const userId = req.user.id; // ID de l'utilisateur connecté (obtenu via le middleware auth)

      console.log(`Target User ID: ${targetUserId}`);
      console.log(`User ID: ${userId}`);

      // Trouver l'utilisateur connecté et l'utilisateur cible
      const user = await User.findById(userId);
      const targetUser = await User.findById(targetUserId);

      if (!user) {
        console.log(`Connected user not found: ${userId}`);
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      if (!targetUser) {
        console.log(`Target user not found: ${targetUserId}`);
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Vérifier si l'utilisateur cible est déjà suivi
      if (user.following.includes(targetUserId)) {
        return res.status(400).json({ message: 'Utilisateur déjà suivi' });
      }

      user.following.push(targetUserId);
      targetUser.followers.push(userId);

      // Sauvegarder les modifications
      await user.save();
      await targetUser.save();

      res.status(200).json({ message: 'Suivi réussi' });
    } catch (error) {
      console.error('Erreur lors du suivi:', error);
      res.status(500).json({ message: 'Erreur lors du suivi' });
    }
  })
);

// Route pour supprimer un utilisateur par son ID
router.delete('delete-user/:id', auth, async (req, res) => {
  try {
      // // Vérifiez si l'utilisateur actuellement connecté est autorisé à supprimer un utilisateur
      // if (req.user.role !== 'admin') {
      //     return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à effectuer cette action' });
      // }

      // Obtenez l'ID de l'utilisateur à supprimer depuis les paramètres de la requête
      const userIdToDelete = req.params.id;

      // Recherchez l'utilisateur à supprimer dans la base de données
      const userToDelete = await User.findById(userIdToDelete);

      // Vérifiez si l'utilisateur existe
      if (!userToDelete) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Supprimez l'utilisateur de la base de données
      await User.findByIdAndDelete(userIdToDelete);

      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// Route pour rechercher une personne par firstName, lastName ou userName
router.get(
  "/search-users",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      // Récupérer les paramètres de recherche de la requête
      const { firstName, lastName, userName } = req.query;

      // Construire un objet de recherche dynamique
      let searchCriteria = {};

      if (firstName) {
        searchCriteria.firstName = { $regex: new RegExp(firstName, 'i') }; // Recherche insensible à la casse
      }
      if (lastName) {
        searchCriteria.lastName = { $regex: new RegExp(lastName, 'i') }; // Recherche insensible à la casse
      }
      if (userName) {
        searchCriteria.userName = { $regex: new RegExp(userName, 'i') }; // Recherche insensible à la casse
      }

      // Vérifier si au moins un critère de recherche est fourni
      if (Object.keys(searchCriteria).length === 0) {
        return res.status(400).json({ message: "Please provide at least one search parameter (firstName, lastName, or userName)" });
      }

      // Interroger la base de données pour trouver les utilisateurs correspondant aux critères de recherche
      const users = await User.find(searchCriteria);

      // Vérifier si des utilisateurs existent
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found matching the search criteria" });
      }

      // Retourner les utilisateurs comme réponse JSON
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

// Route pour récupérer tous les utilisateurs
router.get(
  "/users",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      // Récupérer tous les utilisateurs de la base de données
      const users = await User.find();

      // Vérifier si des utilisateurs existent
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      // Retourner les utilisateurs comme réponse JSON
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

// Route pour désactiver un compte utilisateur
router.put('/desactivate-account/:id', auth, async (req, res) => {
  try {
      const userId = req.params.id;

      // Vérifier si l'ID est un ObjectId valide
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).send('Invalid user ID');
      }

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');
      }

      if (user.desactivatedAccount) {
          return res.status(400).send('Account already deactivated');
      }

      user.desactivatedAccount = true;
      await user.save();

      res.send('The account has been deactivated');
  } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong');
  }
});
router.post('/favorites', async (req, res) => {
  try {
    const { userId, productId, category } = req.body;

console.log("uesrid",userId);
console.log("productId",productId);
console.log("category",category);
    // Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    // Vérifier si le produit est déjà dans les favoris
    const isFavorite = user.favorites.some(favorite => 
      favorite.productId.equals(productId)
    );
   console.log("Vérifier si le produit est déjà dans les favoris",isFavorite);
    if (!isFavorite) {
      user.favorites.push({ productId, category });
      await user.save();
      res.status(200).json(user.favorites);
    } else{
      res.status(400).send("le produit est déjà dans les favoris");
      console.log(" le produit est déjà dans les favoris");
    }

   
  } catch (error) {
    res.status(500).send('Server error');
  }
});
router.delete('/removlistFavoris/:productId', async (req, res) => {
  const { userId } = req.query;
  const { productId } = req.params;
  try {
    console.log("userid ", userId);
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      // Vérifier si le produit est dans les favoris
      const favoriteIndex = user.favorites.findIndex(fav => fav.productId.toString() === productId.toString());
      if (favoriteIndex === -1) {
          return res.status(400).json({ message: 'Produit non trouvé dans les favoris' });
      }

      // Retirer le produit des favoris
      user.favorites.splice(favoriteIndex, 1);
      await user.save();

      res.status(200).json({ favorites: user.favorites });
  } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.get('/favorites/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('favorites.productId');
    if (!user) {
      return res.status(404).send('User not found');
    }
    // Grouper les favoris par catégorie
    const favoritesByCategory = user.favorites.reduce((acc, favorite) => {
      if (!acc[favorite.category]) {
        acc[favorite.category] = [];
      }
      acc[favorite.category].push(favorite.productId);
      return acc;
    }, {});
  console.log("favoritesByCategory",favoritesByCategory);
    res.json(favoritesByCategory);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.get('/favoriteswithproductid/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('favorites.productId');

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Grouper les favoris par catégorie en incluant uniquement les IDs des produits
    const favoritesByCategory = user.favorites.reduce((acc, favorite) => {
      if (!acc[favorite.category]) {
        acc[favorite.category] = [];
      }
      // Ajoutez uniquement les IDs des produits
      acc[favorite.category].push(favorite.productId._id);
      return acc;
    }, {});

    console.log("favoritesByCategory", favoritesByCategory);
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


///// save instagram link
router.post(
  "/save-instagram-link",
  auth,
  asyncMiddleware(async (req, res) => {
    const { instagramLink } = req.body;
    const userId = req.user._id; // Utilisez l'ID utilisateur extrait par le middleware auth

    if (!instagramLink) {
      return res.status(400).send("No Instagram link provided");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { instagramLink } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).send("Instagram link saved successfully");
    } catch (error) {
      console.error("Error saving Instagram link:", error);
      res.status(500).send("Error saving Instagram link");
    }
  })
);

///// save tiktok link
router.post(
  "/save-tiktok-link",
  auth,
  asyncMiddleware(async (req, res) => {
    const {  tiktokLink } = req.body;
    const userId = req.user._id; // Utilisez l'ID utilisateur extrait par le middleware auth

    if (!tiktokLink) {
      return res.status(400).send("No Tiktok link provided");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { tiktokLink } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).send("Tiktok link saved successfully");
    } catch (error) {
      console.error("Error saving Tiktok link:", error);
      res.status(500).send("Error saving Tiktok link");
    }
  })
);

module.exports = router;
