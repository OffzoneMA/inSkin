const winston = require("winston");
const mongoose = require("mongoose");
const settings = require('../config/settings');

module.exports = function () {
  console.log("Avant la connexion à MongoDB");
  console.log("URL de la base de données :", settings.databaseUrl);

  // console.log(settings.databaseUrl)
  // mongoose
  // // ?authSource=admin
  // .connect(`${settings.databaseUrl}/app`, {

  console.log(settings.databaseUrl +"?authSource=admin")
  mongoose
  // ?authSource=admin
  .connect(`${settings.databaseUrl}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('Connexion à MongoDB réussie !');
      console.log(process.env.MONGO_URI);
      console.log(settings.databaseUrl);
      console.log('MONGO_URI:', process.env.MONGO_URI);
      console.log('LOCALHOST:', process.env.LOCALHOST);
      console.log('PORT:', process.env.PORT);
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('JWT_PRIVATE_KEY:', process.env.JWT_PRIVATE_KEY);
      console.log('DEBUG:', process.env.DEBUG);
      console.log('Firbase:', process.env.Firbase);
      winston.info("Connected to Mongodb");
    })
    .catch((err) => {
      console.log('Erreur lors de la connexion à MongoDB :', err.message);
      winston.error("Could not connect to Mongodb database: ", err);
    });
};
