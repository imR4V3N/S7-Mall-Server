const express = require('express');
const router = express.Router();
const demandeLocationController = require('../../controllers/proprietaire/DemandeLocation.controller');

router.post('/', demandeLocationController.create);
router.get('/', demandeLocationController.getAll);
router.get('/:id', demandeLocationController.getById);
router.put('/:id', demandeLocationController.update);
router.delete('/:id', demandeLocationController.delete);
router.get('/centre/:idCentreCommercial', demandeLocationController.getDemandeByCentre);
router.get('/details/:id', demandeLocationController.getDemandeCPLById);
router.get('/proprietaire/:idProprietaire', demandeLocationController.getDemandeByProprietaire);
router.get('/offre/:idOffreLocation', demandeLocationController.getDemandeByOffre);
router.get('/accepter/:id', demandeLocationController.accepterDemande);
router.get('/rejeter/:id', demandeLocationController.rejeterDemande);

module.exports = router;
