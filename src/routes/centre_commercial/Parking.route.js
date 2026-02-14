const express = require("express");
const router = express.Router();
const parkingController = require("../../controllers/centre_commercial/parking.controller");

router.post("/", parkingController.create);
router.get("/", parkingController.getAll);
router.get("/:id", parkingController.getById);
router.put("/:id", parkingController.update);
router.delete("/:id", parkingController.delete);

module.exports = router;
