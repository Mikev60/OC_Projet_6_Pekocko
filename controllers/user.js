const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//Création de l'utilisateur
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // Hachage du mot de passe
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
    .catch(error => res.status(400).json({ error}));
  })
  .catch(error => res.status(500).json({ error}));
};

//Connexion de l'utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if(!user) { //Si pas d'utilisateur trouvé
      return res.status(401);
    }
    bcrypt.compare(req.body.password, user.password) // Comparaison hash mdp / mdp requête
    .then(valid => {
      if(!valid) {
        return res.status(401);
      }
      res.status(200).json({
        userId: user._id,
        token: jwt.sign(
          {userId: user._id},
          'RANDOM_TOKEN_MEGA_SECRET_KEY_TOP_SECURED',
          {expiresIn: '1h'}
        )
      });
    })
    .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error}));
};
