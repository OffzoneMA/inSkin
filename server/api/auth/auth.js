const express = require("express");
const bcrypt = require("bcrypt");
const asyncMiddleware = require("../../middleware/async");
const { User, validate } = require("./models/user");
const auth = require("../../middleware/auth");

const router = express.Router();

const multer = require("multer");

const bodyParser = require('body-parser');

router.use(bodyParser.json());

const upload = multer();

const { faker } = require('@faker-js/faker');

const axios = require('axios');

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

router.put(
  "/update-user-info",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const userId = req.body._id;
      const foundUser = await User.findById(userId);

      // User doesn't exist
      if (!foundUser) {
        res.status(400).send("User does not exist!");
        return;
      }

      // Compare passwords if provided
      

      // Update user properties
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

router.post(
  "/register",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    console.log("erererer")
    if (error) {
      console.log("errer icic",error)
      res.status(400).send(error.details[0].message);
      return;
    }
    console.log("ererereraat")
    console.log("newuser")
    const foundUser = await User.findOne({
      email: req.body.email,
    });
    console.log("newuser")
    if (foundUser) {
      res.status(400).send("A user is already registered with this email!");
      return;
    }
    console.log("newuser")
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("mamama")
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
    console.log("mamama")
    // Fetch image from the URL and convert it to a buffer
    const imageURL = faker.image.avatar(); 
    console.log("hahahahahahah")
    // Replace with the actual URL to your image
    //const imageBuffer = await getImageBufferFromURL(imageURL);
    console.log("mamamababababab")
    console.log("newuser")
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
    console.log("newuser")
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

// Route to update profile image
router.put(
  "/update-profile-image",
  auth, 
  upload.single('image'),
  asyncMiddleware(async (req, res) => {
    const userId = req.body._id; // Assuming you have the user ID in the request object
    
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

module.exports = router;
