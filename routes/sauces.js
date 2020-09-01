const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const saucesControllers = require('../controllers/sauces');

const Sauce = require('../models/sauces');

const multer = require('../middleware/multer-config');


router.post('/', auth, multer, saucesControllers.addSauce);
router.get('/', auth, saucesControllers.afficherSauces);
router.get('/:id', auth, saucesControllers.afficherSauce);
router.put('/:id', auth, multer, saucesControllers.modifierSauce);
router.delete('/:id', auth, saucesControllers.supprimerSauce);
router.post('/:id/like', auth, saucesControllers.approbationSauce); 

module.exports = router;
