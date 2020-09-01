const mongoose = require('mongoose');

//Plugin pour l'email unqique
const uniqueValidator = require('mongoose-unique-validator');

//Création du schéma USER
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique:true},
  password: {type: String, required:true}
});

userSchema.plugin(uniqueValidator);  

module.exports = mongoose.model('User', userSchema);
