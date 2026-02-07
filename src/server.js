const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/db");
require('dotenv').config();
var centreCommercialRoutes = require('src/routes/centre_commercial/CentreCommercial.route');
var authRoutes = require('src/routes/authentification/Authentification.route');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/centre", centreCommercialRoutes);
app.use("/api/authentification", authRoutes);
// Connexion à MongoDB
connectDB();

// Démarrer le serveur
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
