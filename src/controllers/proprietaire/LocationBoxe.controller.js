const DemandeLocation = require("../../models/proprietaire/DemandeLocation.model");
const LocationBoxe = require("../../models/proprietaire/LocationBoxe.model");
const Boutique = require("../../models/proprietaire/Boutique.model");
const mongoose = require("mongoose");
const {ConstanteEtat} = require("../../config/constante");
const Notification = require("../../models/notification/Notification.model");
const Boxe = require("../../models/centre_commercial/Boxe.model");
exports.create = async (req, res) => {
    try {
        const item = new LocationBoxe(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        let item = await LocationBoxe.findById(req.params.id);
        if (item.idBoutique){
            let old_boutique = await Boutique.findById(item.idBoutique);
            old_boutique.idBoxe = "";
            old_boutique.status = 3;
            await old_boutique.save();
        }
        item = await LocationBoxe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        if (item.idBoutique){
            let boutique = await Boutique.findById(item.idBoutique);
            boutique.idBoxe = item.idBoxe;
            await boutique.save();
        }
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. NETTOIE L'ID (supprime espaces, retours à la ligne)
        const cleanId = id.toString().trim();

        const item = await LocationBoxe.findOneAndDelete({
            _id: {
                $eq: cleanId,           // Égalité stricte
                $type: "string"         // Force le type string
            }
        });
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json({ message: "Item supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCPLById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await LocationBoxe.aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $lookup: {
                    from: "proprietaire",
                    localField: "idProprietaire",
                    foreignField: "_id",
                    as: "proprietaireInfo"
                }
            },
            {
                $unwind: "$proprietaireInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: {
                    path: "$boutiqueInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    idBoutique: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo",
                    boutique:"$boutiqueInfo"
                }
            }
        ]);
        if (result.length==0){
            res.status(404).json({message:"Item introuvable"})
        }
        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCPLByIdCentreCommercial = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await LocationBoxe.aggregate([
            {
                $lookup: {
                    from: "proprietaire",
                    localField: "idProprietaire",
                    foreignField: "_id",
                    as: "proprietaireInfo"
                }
            },
            {
                $unwind: "$proprietaireInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $match: {
                    "boxeInfo.idCentreCommercial": id
                }
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: {
                    path: "$boutiqueInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    idBoutique: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo",
                    boutique:"$boutiqueInfo"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCPLByIdProprietaire = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await LocationBoxe.aggregate([
            {
                $match: {
                    idProprietaire: id
                }
            },
            {
                $lookup: {
                    from: "proprietaire",
                    localField: "idProprietaire",
                    foreignField: "_id",
                    as: "proprietaireInfo"
                }
            },
            {
                $unwind: "$proprietaireInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: {
                    path: "$boutiqueInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    idBoutique: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo",
                    boutique:"$boutiqueInfo"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.bloquer = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await LocationBoxe.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.status = ConstanteEtat.OCCUPEE;
        await item.save();
        if (item.idBoutique){
            let boutique = await Boutique.findById(item.idBoutique);
            boutique.idBoxe = "";
            boutique.status = ConstanteEtat.OCCUPEE;
            await boutique.save();
        }
        let boxe = await Boxe.findById(item.idBoxe);
        boxe.status = ConstanteEtat.DISPONIBLE;
        await boxe.save();
        const notification = new Notification({
            idUser: item.idProprietaire,
            title: "Suspension de votre boxe",
            message: `Votre boxe ${boxe.nom} a été suspendue. Veuillez contacter l'administration pour plus d'informations.`,
            lien: `owner/location_boxe/details/${item._id}`,
            badge: "<div class=\"notification-icon\" style=\"background-color: #fef3c7;color: #fbbf24;\">\n" +
                "                    <i class=\"fa fa-warning\"></i>\n" +
                "                  </div>",
        });
        await notification.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.debloquer = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await LocationBoxe.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.status = ConstanteEtat.DISPONIBLE;
        await item.save();
        if (item.idBoutique){
            let boutique = await Boutique.findById(item.idBoutique);
            boutique.idBoxe = item.idBoxe;
            await boutique.save();
        }
        let boxe = await Boxe.findById(item.idBoxe);
        boxe.status = ConstanteEtat.OCCUPEE;
        await boxe.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCPLByIdBoxe = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await LocationBoxe.aggregate([
            {
                $match: {
                    idBoxe: id
                }
            },
            {
                $lookup: {
                    from: "proprietaire",
                    localField: "idProprietaire",
                    foreignField: "_id",
                    as: "proprietaireInfo"
                }
            },
            {
                $unwind: "$proprietaireInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: {
                    path: "$boutiqueInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    idBoutique: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo",
                    boutique:"$boutiqueInfo"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCPLByIdProprietaireAndDisponible = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await LocationBoxe.aggregate([
            {
                $match: {
                    idProprietaire: id,
                    status: ConstanteEtat.DISPONIBLE
                }
            },
            {
                $lookup: {
                    from: "proprietaire",
                    localField: "idProprietaire",
                    foreignField: "_id",
                    as: "proprietaireInfo"
                }
            },
            {
                $unwind: "$proprietaireInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
            },
            {
                $lookup: {
                    from: "boutique",
                    localField: "idBoutique",
                    foreignField: "_id",
                    as: "boutiqueInfo"
                }
            },
            {
                $unwind: {
                    path: "$boutiqueInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    idBoutique: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo",
                    boutique:"$boutiqueInfo"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
