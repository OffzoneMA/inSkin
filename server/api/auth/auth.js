const express = require("express");
const bcrypt = require("bcrypt");
const asyncMiddleware = require("../../middleware/async");
const { User, validate } = require("./models/user");
const PasswordReset = require("./models/PasswordReset");
const auth = require("../../middleware/auth");
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
// let transporter = nodemailer.createTransport({
//   service:"gmail",
//   auth:{
//     user:process.env.AUTH_EMAIL,
//     pass:process.env.AUTH_PASS,
//   },
// });

// transporter.verify((error,success)=>{
//   if(error){
//     console.log(error);

//   }else{
//     console.log("Ready for message", success);
//   }
// });
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


c

module.exports = router;
