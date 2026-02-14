const Parking = require("../../models/centre_commercial/Parking.model");
const Boxe = require("../../models/centre_commercial/Boxe.model");

exports.create = async (req, res) => {
    try {
        const parking = await Parking.create(req.body);
        res.status(201).json(parking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const parkings = await Parking.find();
        res.json(parkings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const parking = await Parking.findById(req.params.id);

        if (!parking) {
            return res.status(404).json({ message: "Parking introuvable" });
        }

        res.json(parking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const parking = await Parking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!parking) {
            return res.status(404).json({ message: "Parking introuvable" });
        }

        res.json(parking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const parking = await Parking.findByIdAndDelete(req.params.id);

        if (!parking) {
            return res.status(404).json({ message: "Parking introuvable" });
        }

        res.json({ message: "Parking supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByCentre = async (req, res) => {
    try {
        const { idCentreCommercial } = req.params;
        const result = await Parking.aggregate([
            { $match: { idCentreCommercial: idCentreCommercial } },
            {
                $lookup: {
                    from: "centre_commercial",    // collection cible
                    localField: "idCentreCommercial", // champ dans Boxe
                    foreignField: "_id",          // champ dans CentreCommercial (string)
                    as: "centre"
                }
            },
            { $unwind: { path: "$centre", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    placeDisponible: 1,
                    placeTotal: 1,
                    tarifParHeure: 1,
                    dureeMax: 1,
                    centre: { nomCentreCommercial: "$centre.nom", adresseCentreCommercial: "$centre.adresse" }
                }
            }
        ]);
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Aucune parking trouvée pour ce centre commercial" });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
