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

router.get(
  "/status",
  auth,
  asyncMiddleware(async (req, res) => {
    res.status(200).send("OK");
  })
);

router.post(
  "/register",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const foundUser = await User.findOne({
      email: req.body.email,
    });
    
    if (foundUser) {
      res.status(400).send("A user is already registered with this email!");
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

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

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: userName,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    const token = newUser.generateAuthToken();
    res
      .header("bearer-token", token)
      .json({ message: "Registration Successful!" });
  })
);


// Route to update profile image
router.put(
  "/update-profile-image",
  /* auth, */
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
  /* auth, */ // Ensure the user is authenticated to access this route
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
router.get("/get-users-byids", async (req, res) => {
  try {
      // Retrieve an array of brand IDs from the request query parameters
      const userIds = req.query.ids.split(',');

      console.log(userIds);

      // Query the database to find brands by IDs
      const users = await User.find({ _id: { $in: userIds } });
      console.log(users);

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
});

module.exports = router;
