const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const user = require('./routes/user')
const sauce = require('./routes/sauce')
const app = express();

mongoose.connect('mongodb+srv://Benjamin-83:EkiyyyAEgf1zpxJ9@piiquante.3ruxlci.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use('/api/auth', user)
app.use('/api', sauce)

app.use((req, res) => {
  res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;