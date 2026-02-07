const express = require("express");
const {
    createCentre,
    getCentres,
    getCentreById
} = require("src/controllers/centre_commercial/centreCommercial.controller");

const router = express.Router();

// ➕ Créer un centre commercial
router.post("/", createCentre);

// 📄 Lister tous les centres commerciaux
router.get("/", getCentres);

// 🔍 Récupérer un centre par ID
router.get("/:id", getCentreById);

module.exports = router;
