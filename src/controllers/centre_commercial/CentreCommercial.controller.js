const CentreCommercial = require("../../models/centre_commercial/centreCommercial.model");
const Authentification = require("../../models/authentification/Authentification.model");
const Role = require("../../models/authentification/Role.model");
const mongoose = require("mongoose");
// Créer un centre commercial
exports.createCentre = async (req, res) => {
    try {
        const { identifiant, mdp, ...centreData } = req.body;

        if (!identifiant || !mdp) {
            return res.status(400).json({ erreura: "identifiant et mdp requis" });
        }

        // Création du centre commercial
        const centre = new CentreCommercial(centreData);
        await centre.save(); // hook 'pre save' du centre si existant

        // Création de l'authentification
        const role = await Role.findById("698712f076c4f14d630bb34a"); // rôle "centre commercial"
        const auth = new Authentification({
            idUser: centre._id,
            idRole: role._id, // rôle "centre commercial"
            identifiant,
            mdp // sera hashé automatiquement par le hook 'pre save'
        });
        await auth.save();

        res.status(201).json({
            centre: centre,
            authentification: auth
        });

    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
};

// Lister tous les centres
exports.getCentres = async (req, res) => {
    const centres = await CentreCommercial.find();
    res.json(centres);
};

// Récupérer un centre par ID
exports.getCentreById = async (req, res) => {
    const centre = await CentreCommercial.findById(req.params.id);
    if (!centre) {
        return res.status(404).json({ message: "Centre non trouvé" });
    }
    res.json(centre);
};
