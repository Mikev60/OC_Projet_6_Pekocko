const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config()

const app = express();

const helmet = require('helmet'); 

const UserRoutes = require('./routes/user');
const SaucesRoutes = require('./routes/sauces');

mongoose.connect('mongodb+srv://'+process.env.DBUSER+':'+process.env.DBPASSWORD+'@cluster0.1lxrd.mongodb.net/Pekoko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet()); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth/', UserRoutes);
app.use('/api/sauces/', SaucesRoutes);

module.exports = app;
