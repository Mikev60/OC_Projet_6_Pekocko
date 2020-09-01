const Sauce = require('../models/sauces');
const fs = require('fs');

exports.addSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save()
  .then(() => {
    res.status(201).json({ message: 'Sauce créée '})
  })
  .catch(error => res.status(400).json({error: error}));
};

exports.afficherSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json(error));
};

exports.afficherSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json(error));
};

exports.modifierSauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id:req.params.id})
  .then(() => res.status(200).json({ message: 'Sauce modifiée '}))
  .catch(error => res.status(400).json({ error }));
};

exports.supprimerSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
    Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé '}))
    .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

//fonction de gestion du like et du dislike
exports.approbationSauce = (req, res, next) => {
  let likeOrDislike = req.body.like;
  let userId = req.body.userId;
  Sauce.findOne({ _id: req.params.id })
  .then( sauce => {

    if (likeOrDislike === 1) { // Si l'utilisateur aime la sauce
      console.log('1');
      Sauce.updateOne({ _id: req.params.id } , {$push: {usersLiked: userId}, $inc: {likes: +1 },})
      .then(res.status(200).json({ message: "L'utilisateur a aimé cette sauce "}))
      .catch(error => res.status(400).json({ error }));
    }

    else if (likeOrDislike === -1) { // S'il n'aime pas la sauce
      console.log('-1');
      Sauce.updateOne({ _id: req.params.id } , {$push: {usersDisliked: userId}, $inc: {dislikes: +1 },})
      .then(res.status(200).json({ message: "L'utilisateur n'a pas aimé cette sauce "}))
      .catch(error => res.status(400).json({ error }));
    }

    else if (likeOrDislike === 0) { // S'il annule ce qu'il aime ou n'aime pas
      let indexUser = sauce.usersLiked.indexOf(userId);
      console.log(indexUser);

      if(indexUser > -1 ) { //Si l'user est trouvé dans le tableau des likes
        sauce.usersLiked.slice(indexUser, 1);
        console.log('slice effectué');
        Sauce.updateOne({ _id: req.params.id } , {$push: { usersLiked: {$each: [ ], $slice: indexUser} }, $inc: { likes: -1 },})
        .then(() => res.status(200).json({ message: ' Like enlevé ' }))
        .catch((error) => res.status(400).json({ error }));
      }
      else if(indexUser === -1) { //S'il n'est pas trouvé dans le tableau likes === dislikes
        const indexUserDisliked = sauce.usersDisliked.indexOf(userId);
        sauce.usersDisliked.slice(indexUserDisliked, 1);
        console.log('slice effectué');
        Sauce.updateOne({ _id: req.params.id },{$push: { usersDisliked: {$each: [ ], $slice: indexUserDisliked} }, $inc: { dislikes: -1 },})
        .then(() => res.status(200).json({ message: ' Dislike supprimé ' }))
        .catch((error) => res.status(400).json({ error }))
      }
    }
  })
  .catch(error => res.status(400).json({ error }));
};
