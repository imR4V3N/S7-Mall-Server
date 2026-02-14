const Boxe = require("../../models/centre_commercial/Boxe.model");

exports.createBoxe = async (req, res) => {
    try {
        const boxe = new Boxe(req.body);
        await boxe.save();
        res.status(201).json(boxe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllBoxe = async (req, res) => {
    try {
        const boxe = await Boxe.find().populate("idCentreCommercial", "nom adresse");
        res.json(boxe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBoxeById = async (req, res) => {
    try {
        const boxe = await Boxe.findById(req.params.id).populate("idCentreCommercial", "nom adresse");
        if (!boxe) return res.status(404).json({ message: "Boxe introuvable" });
        res.json(boxe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBoxe = async (req, res) => {
    try {
        const boxe = await Boxe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!boxe) return res.status(404).json({ message: "Boxe introuvable" });
        res.json(boxe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteBoxe = async (req, res) => {
    try {
        const boxe = await Boxe.findByIdAndDelete(req.params.id);
        if (!boxe) return res.status(404).json({ message: "Boxe introuvable" });
        res.json({ message: "Boxe supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBoxeByCentre = async (req, res) => {
    try {
        const { idCentreCommercial } = req.params;
        const result = await Boxe.aggregate([
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
                    nom: 1,
                    description: 1,
                    status: 1,
                    longueur: 1,
                    largeur: 1,
                    centre: { nomCentreCommercial: "$centre.nom", adresseCentreCommercial: "$centre.adresse" }
                }
            }
        ]);
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Aucune boxe trouvée pour ce centre commercial" });
        }
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
