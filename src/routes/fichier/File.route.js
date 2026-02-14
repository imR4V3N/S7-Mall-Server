const express = require("express");
const router = express.Router();

const controller = require("../../controllers/fichier/File.controller");

router.post("/", controller.create);
router.post("/insertFilleMultiple", controller.createMultiple);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
// router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/proprietaire/:idProprietaire", controller.findByIdProprietaireAndType);

module.exports = router;
