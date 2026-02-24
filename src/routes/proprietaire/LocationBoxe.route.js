const express = require('express');
const router = express.Router();

const locationBoxeController = require('../../controllers/proprietaire/LocationBoxe.controller');

router.post('/', locationBoxeController.create);
router.get('/details/:id', locationBoxeController.getCPLById);
router.put('/:id', locationBoxeController.update);
router.delete('/:id', locationBoxeController.delete);
router.get('/proprietaire/:id', locationBoxeController.getCPLByIdProprietaire);
router.get('/boxe/:id', locationBoxeController.getCPLByIdBoxe);
router.get('/centre/:id', locationBoxeController.getCPLByIdCentreCommercial);
router.get('/bloquer/:id', locationBoxeController.bloquer);
router.get('/debloquer/:id', locationBoxeController.debloquer);
router.get('/proprietaire/disponible/:id', locationBoxeController.getCPLByIdProprietaireAndDisponible);

module.exports = router;
