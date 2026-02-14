const express = require("express");
const router = express.Router();
const itemController = require("../../controllers/centre_commercial/OffreDeLocation.controller");

router.post("/", itemController.create);
router.get("/", itemController.getAll);
router.get("/:id", itemController.getById);
router.put("/:id", itemController.update);
router.delete("/:id", itemController.delete);
router.get("/centre/:idCentreCommercial", itemController.getOffresByCentre);
router.get("/boxe/:idBoxe", itemController.getOffresByBoxe);
router.get("/details/:id", itemController.getOffresCpl);
router.get("/status/disponible", itemController.getOffresDisponible);

module.exports = router;
