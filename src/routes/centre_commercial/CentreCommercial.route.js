const express = require("express");
const controller = require("../../controllers/centre_commercial/CentreCommercial.controller");

const router = express.Router();

// ➕ Créer un centre commercial
router.post("/", controller.createCentre);

// 📄 Lister tous les centres commerciaux
router.get("/", controller.getCentres);

// 🔍 Récupérer un centre par ID
router.get("/:id", controller.getCentreById);
router.put("/:id", controller.update);
router.get("/ouvrir/:id", controller.ouvrir);
router.get("/fermer/:id", controller.fermer);
router.get("/details/:id", controller.getCPLById);
router.get("/etatLoyer/:id", controller.getRepartitionLoyerMensuel);
router.get("/visiteurs/:id", controller.getNombreVisiteur);

module.exports = router;
