const express = require('express');
const router = express.Router();

const caisseController = require('../../controllers/caisse/Caisse.controller');

router.post('/', caisseController.create);
router.get('/', caisseController.getAll);
router.get('/:id', caisseController.getById);
router.put('/:id', caisseController.update);
router.delete('/:id', caisseController.delete);
router.get('/proprietaire/:idProprietaire', caisseController.getAllByIdProprietaire);

module.exports = router;
