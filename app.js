const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const path = require('path');

const stuffRoutes = require('./routes/stuff');

const userRoutes = require('./routes/user')


mongoose
  .connect(
    "mongodb+srv://Varin:Lucky45000@cluster0.bbuwmdq.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  app.use(express.json()); //intercèpte touts les requête de type json et le met à dispo avec req.body


//Permet à l'application d'accéder à l'API sans problème//
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // L'origine qui a le droit d'accéder à notre API c'est tout le monde *//
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"); // On donne l'autorisation d'utiliser certains Headers sur l'objet requête"
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"); //On autorise certaine methode (les verbes de requêtes : GET, POST, PUT, ect...)
  next();
});

app.use(bodyParser.json());

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname,'images')));

module.exports = app;
