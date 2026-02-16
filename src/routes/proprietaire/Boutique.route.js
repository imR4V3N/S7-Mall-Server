const express = require('express');
const router = express.Router();
const boutiqueController = require('../../controllers/proprietaire/Boutique.controller');

router.post('/', boutiqueController.create);
router.get('/', boutiqueController.getAll);
router.get('/:id', boutiqueController.getById);
router.put('/:id', boutiqueController.update);
router.delete('/:id', boutiqueController.delete);
router.get('/proprietaire/:idProprietaire', boutiqueController.getBoutiqueByIdProprietaire);
router.get('/centre/:idCentreCommercial', boutiqueController.getBoutiqueByIdCentreCommercial);
router.get('/details/:id', boutiqueController.getBoutiqueCPLById);
router.get('/fermer/:id', boutiqueController.fermerBoutique);
router.get('/ouvrir/:id', boutiqueController.ouvrirBoutique);

module.exports = router;
