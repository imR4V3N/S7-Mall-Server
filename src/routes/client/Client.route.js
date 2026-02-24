const express = require("express");
const router = express.Router();
const itemController = require("../../controllers/client/Client.controller");

router.post("/", itemController.create);
router.get("/", itemController.getAll);
router.get("/:id", itemController.getById);
router.get("/boutique/:id",itemController.getByIdBoutique);
router.put("/:id", itemController.update);
// router.delete("/:id", itemController.delete);

module.exports = router;
