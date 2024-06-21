const winston = require("winston");
const mongoose = require("mongoose");
const settings = require('./config/settings');

// Définition du schéma du modèle User
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  // Autres champs du modèle
});

// Création du modèle User à partir du schéma
const User = mongoose.model('User', userSchema);

console.log("Avant la connexion à MongoDB");
console.log("URL de la base de données :", settings.databaseUrl);

mongoose
  .connect(`${settings.databaseUrl}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log('Connexion à MongoDB réussie !');
    winston.info("Connected to Mongodb");

    // Création d'un utilisateur exemple pour démonstration
    const exampleUser = new User({
      username: 'john_doe',
      email: 'john@example.com',
      // Autres champs du modèle
    });

    // Enregistrement de l'utilisateur dans la base de données
    await exampleUser.save();
    console.log('Utilisateur enregistré avec succès dans la base de données.');

    // Recherche et affichage de tous les utilisateurs dans la base de données
    User.find({}, (err, users) => {
      if (err) {
        console.error('Erreur lors de la recherche des utilisateurs :', err);
        return;
      }
      console.log('Utilisateurs dans la base de données :');
      console.log(users);
    });
  })
  .catch((err) => {
    console.log('Erreur lors de la connexion à MongoDB :', err.message);
    winston.error("Could not connect to Mongodb database: ", err);
  });
