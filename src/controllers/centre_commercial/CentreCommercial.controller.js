const CentreCommercial = require("src/models/centre_commercial/centreCommercial.model");
const Authentification = require("src/models/authentification/Authentification.model");
const mongoose = require("mongoose");
// Créer un centre commercial
exports.createCentre = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { identifiant, mdp, ...centreData } = req.body;

        if (!identifiant || !mdp) {
            throw new Error("identifiant et mdp requis");
        }

        const centre = await CentreCommercial.create(
            [centreData],
            { session }
        );

        const auth = await Authentification.create(
            [{
                idUser: centre[0]._id,
                idRole: 1, // rôle "centre commercial"
                identifiant,
                mdp
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            centre: centre[0],
            authentification: auth[0]
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
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
