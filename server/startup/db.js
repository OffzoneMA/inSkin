const winston = require("winston");
const mongoose = require("mongoose");
const settings = require('../config/settings');

module.exports = function () {
  console.log("Avant la connexion à MongoDB");
  console.log("URL de la base de données :", settings.databaseUrl);
  console.log(settings.databaseUrl +"?authSource=admin")
  mongoose
  // ?authSource=admin
  .connect(`${settings.databaseUrl}/app`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('Connexion à MongoDB réussie !');
      winston.info("Connected to Mongodb");
    })
    .catch((err) => {
      console.log('Erreur lors de la connexion à MongoDB :', err.message);
      winston.error("Could not connect to Mongodb database: ", err);
    });
};
