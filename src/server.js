require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/db");
const centreCommercialRoutes = require('./routes/centre_commercial/CentreCommercial.route');
const authRoutes = require('./routes/authentification/Authentification.route');
const roleRoutes = require('./routes/authentification/Role.route');
const boxeRoutes = require('./routes/centre_commercial/Boxe.route');
const offreRoutes = require('./routes/centre_commercial/OffreDeLocation.route');
const proprietaireRoutes = require('./routes/proprietaire/Proprietaire.route');
const {getAuthParams} = require("./controllers/Upload.controller");
const fileTypeRoutes = require('./routes/fichier/FileType.route');
const fileRoutes = require('./routes/fichier/File.route');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/centre", centreCommercialRoutes);
app.use("/api/authentification", authRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/boxe", boxeRoutes);
app.use("/api/offre",offreRoutes);
app.use("/api/proprietaire",proprietaireRoutes);
app.get('/api/imagekit/auth', getAuthParams);
app.use("/api/filetype", fileTypeRoutes);
app.use("/api/file", fileRoutes);
// Connexion à MongoDB
connectDB();

// Démarrer le serveur
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
