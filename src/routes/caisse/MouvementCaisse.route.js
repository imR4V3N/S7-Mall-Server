const express = require('express');
const router = express.Router();
const mouvementCaisseController = require('../../controllers/caisse/MouvementCaisse.controller');

router.post('/', mouvementCaisseController.create);
router.get('/', mouvementCaisseController.getAll);
router.get('/:id', mouvementCaisseController.getById);
router.put('/:id', mouvementCaisseController.update);
router.delete('/:id', mouvementCaisseController.delete);
router.get('/details/:id', mouvementCaisseController.getCplById);
router.get('/proprietaire/:id', mouvementCaisseController.getCplByIdProprietaire);
router.get('/caisse/:idCaisse', mouvementCaisseController.getAllByIdCaisse);
router.get('/valider/:id', mouvementCaisseController.valider);

module.exports = router;
