const express = require("express");
const router = express.Router();
const boxeController = require("../../controllers/centre_commercial/Boxe.controller");

router.post("/", boxeController.createBoxe);
router.get("/", boxeController.getAllBoxe);
router.get("/:id", boxeController.getBoxeById);
router.put("/:id", boxeController.updateBoxe);
router.delete("/:id", boxeController.deleteBoxe);
router.get("/centre/:idCentreCommercial", boxeController.getBoxeByCentre);

module.exports = router;
