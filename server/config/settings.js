const { log } = require("winston");
const mongoose = require('mongoose');
const winston = require('winston');
const dotenv = require("dotenv");
dotenv.config();
const settings = {
    dev: {
      localhost: process.env.LOCALHOST,
      port: process.env.PORT,
      environment: process.env.NODE_ENV,
      debug: process.env.DEBUG,
      databaseUrl: process.env.MONGO_URI,
      jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
      firebaseDatabaseUrl:process.env.Firbase
    },
    staging: {
      localhost: process.env.LOCALHOST,
      port: process.env.PORT,
      environment: process.env.NODE_ENV,
      debug: process.env.DEBUG,
      databaseUrl: process.env.MONGO_URI,
      jwtPrivateKey: process.env.JWT_PRIVATE_KEY
    },
    prod: {},
  };
  const getCurrentSettings = () => {
    if (process.env.NODE_ENV == 'development'){
      
      return settings.dev;
    }
    if (process.env.NODE_ENV == 'staging'){
      console.log("shshshshshhs")
      return settings.staging;
    } 
    return settings.prod;
  };
//   const dbURI = getCurrentSettings().databaseUrl;
//   console.log("hdhdhdh",dbURI)

// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Connexion à la base de données MongoDB réussie');
//         winston.info('Connexion à la base de données MongoDB réussie'); // Log using Winston
//     })
//     .catch(err => {
//         console.error('Erreur de connexion à la base de données MongoDB:', err);
//         winston.error('Erreur de connexion à la base de données MongoDB:', err); // Log using Winston
//         process.exit(1); // Exit the application if database connection fails
//     });
  module.exports = getCurrentSettings();
  