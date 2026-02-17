const express = require("express");
const router = express.Router();

const controller = require("../../../controllers/proprietaire/produit/Produit.controller");

router.post("/", controller.create);
router.post("/insertMereFille", controller.insertMereFille);
router.get("/", controller.getAll);
router.get("/schema/boutique/:id", controller.getAllByBoutique);
router.put("/updateMereFille/:id", controller.updateMereFille);
router.get("/details/:id", controller.getProduitCplById);
router.get("/boutique/:idBoutique", controller.getProduitCplByIdBoutique);
router.get("/centre/:idCentreCommercial", controller.getProduitCplByIdCentreCommercial);
router.get("/changerStatus/:id", controller.changerStatus);

module.exports = router;
