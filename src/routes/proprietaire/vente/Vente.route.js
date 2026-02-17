const express = require("express");
const router = express.Router();

const controller = require("../../../controllers/proprietaire/vente/Vente.controller");

router.post("/insertMereFille", controller.insertMereFille);
router.get("/", controller.getAll);
router.put("/updateMereFille/:id", controller.updateMereFille);
router.get("/details/:id", controller.getCplById);
router.get("/boutique/:id", controller.getCplByIdBoutique);
router.get("/valider/:id", controller.valider);
router.delete('/:id', controller.deleteMereEtFilles);
router.get("/filles/:idMere",controller.getFilleByIdMere);

module.exports = router;
