const express = require("express");
const router = express.Router();

const controller = require("../../controllers/authentification/Authentification.controller");

router.post("/", controller.create);
router.post("/login", controller.loginWithRole);
router.get("/", controller.findAll);
router.get("/:idUser", controller.findByIdUser);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
