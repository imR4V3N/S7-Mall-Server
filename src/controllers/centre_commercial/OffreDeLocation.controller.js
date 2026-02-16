const OffreDeLocation = require("../../models/centre_commercial/OffreDeLocation.model");
const Boxe = require("../../models/centre_commercial/Boxe.model");
const {ConstanteEtat} = require("../../config/constante");
const mongoose = require("mongoose");
exports.create = async (req, res) => {
    try {
        const item = new OffreDeLocation(req.body);
        await item.save();
        const boxe = await Boxe.findById(item.idBoxe);
        boxe.status = ConstanteEtat.EN_ATTENTE;
        await boxe.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const item = await OffreDeLocation.find().populate("idBoxe", "idCentreCommercial nom description");
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await OffreDeLocation.findById(req.params.id).populate("idBoxe", "idCentreCommercial nom description");
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await OffreDeLocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: "Item introuvable" });
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

        const item = await OffreDeLocation.findOneAndDelete({
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

exports.getOffresByCentre = async (req, res) => {
    try {
        const { idCentreCommercial } = req.params;

        const result = await OffreDeLocation.aggregate([
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
                    "boxeInfo.idCentreCommercial": idCentreCommercial
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
                    from: "file",
                    let: { boxeId: "$boxeInfo._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$boxeId"] },
                                idType: new mongoose.Types.ObjectId("69907176993485024f2c116d")
                            }
                        },
                        { $sort: { date: -1 } }, // 👈 TRI PAR DATE DÉCROISSANTE (plus récent d'abord)
                        { $limit: 1 } // 👈 PRENDRE SEULEMENT LA PREMIÈRE (la plus récente)
                    ],
                    as: "photoPrincipale"
                }
            },
            {
                $lookup: {
                    from: "file",
                    localField: "boxeInfo._id",
                    foreignField: "idProprietaire",
                    as: "toutesLesPhotos"
                }
            },
            {
                $project: {
                    _id: 1,
                    description: 1,
                    montantLoyer: 1,
                    date: 1,
                    status: 1,
                    idBoxe: "$boxeInfo._id",
                    nomBoxe: "$boxeInfo.nom",
                    longueurBoxe: "$boxeInfo.longueur",
                    largeurBoxe: "$boxeInfo.largeur",
                    idCentreCommercial: "$centreInfo._id",
                    nomCentreCommercial: "$centreInfo.nom",
                    photoBoxe: {
                        $arrayElemAt: ["$photoPrincipale", 0]
                    },
                    autrePhoto: "$toutesLesPhotos",
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOffresCpl = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await OffreDeLocation.aggregate([
            {
                $match: {
                    "_id": id
                }
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
                    from: "file",
                    let: { boxeId: "$boxeInfo._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$boxeId"] },
                                idType: new mongoose.Types.ObjectId("69907176993485024f2c116d")
                            }
                        },
                        { $sort: { date: -1 } }, // 👈 TRI PAR DATE DÉCROISSANTE (plus récent d'abord)
                        { $limit: 1 } // 👈 PRENDRE SEULEMENT LA PREMIÈRE (la plus récente)
                    ],
                    as: "photoPrincipale"
                }
            },
            {
                $lookup: {
                    from: "file",
                    localField: "boxeInfo._id",
                    foreignField: "idProprietaire",
                    as: "toutesLesPhotos"
                }
            },
            {
                $project: {
                    _id: 1,
                    description: 1,
                    montantLoyer: 1,
                    date: 1,
                    status: 1,
                    idBoxe: "$boxeInfo._id",
                    nomBoxe: "$boxeInfo.nom",
                    longueurBoxe: "$boxeInfo.longueur",
                    largeurBoxe: "$boxeInfo.largeur",
                    idCentreCommercial: "$centreInfo._id",
                    nomCentreCommercial: "$centreInfo.nom",
                    photoBoxe: {
                        $arrayElemAt: ["$photoPrincipale", 0]
                    },
                    autrePhoto: "$toutesLesPhotos",
                }
            }
        ]);

        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOffresByBoxe = async (req, res) => {
    try {
        const { idBoxe } = req.params;

        const result = await OffreDeLocation.aggregate([
            {
                $match: {
                    "idBoxe": idBoxe
                }
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
                $project: {
                    _id: 1,
                    description: 1,
                    montantLoyer: 1,
                    date: 1,
                    status: 1,
                    idBoxe: "$boxeInfo._id",
                    nomBoxe: "$boxeInfo.nom",
                    longueurBoxe: "$boxeInfo.longueur",
                    largeurBoxe: "$boxeInfo.largeur",
                    idCentreCommercial: "$centreInfo._id",
                    nomCentreCommercial: "$centreInfo.nom"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOffresDisponible = async (req, res) => {
    try {
        var status = ConstanteEtat.DISPONIBLE;
        console.log("Status recherché pour les offres disponibles : ", status);
        const result = await OffreDeLocation.aggregate([
            {
                $match: {
                    "status": status
                }
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            { $unwind: "$boxeInfo" },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            { $unwind: "$centreInfo" },
            {
                $lookup: {
                    from: "file",
                    let: { boxeId: "$boxeInfo._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$boxeId"] },
                                idType: new mongoose.Types.ObjectId("69907176993485024f2c116d")
                            }
                        },
                        { $sort: { date: -1 } }, // 👈 TRI PAR DATE DÉCROISSANTE (plus récent d'abord)
                        { $limit: 1 } // 👈 PRENDRE SEULEMENT LA PREMIÈRE (la plus récente)
                    ],
                    as: "photoPrincipale"
                }
            },
            {
                $lookup: {
                    from: "file",
                    localField: "boxeInfo._id",
                    foreignField: "idProprietaire",
                    as: "toutesLesPhotos"
                }
            },
            {
                $project: {
                    _id: 1,
                    description: 1,
                    montantLoyer: 1,
                    date: 1,
                    status: 1,
                    idBoxe: "$boxeInfo._id",
                    nomBoxe: "$boxeInfo.nom",
                    longueurBoxe: "$boxeInfo.longueur",
                    largeurBoxe: "$boxeInfo.largeur",
                    idCentreCommercial: "$centreInfo._id",
                    nomCentreCommercial: "$centreInfo.nom",
                    // Photo principale (la plus récente avec le bon idType)
                    photoBoxe: {
                        $arrayElemAt: ["$photoPrincipale", 0]
                    },
                    // Informations complètes de la photo principale (optionnel)
                    autrePhoto: "$toutesLesPhotos",
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
