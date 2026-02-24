const Boutique = require("../../models/proprietaire/Boutique.model");
const Boxe = require("../../models/centre_commercial/Boxe.model");
const DemandeLocation = require("../../models/proprietaire/DemandeLocation.model");
const {ConstanteEtat} = require("../../config/constante");
const mongoose = require("mongoose");
exports.create = async (req, res) => {
    try {
        const item = new Boutique(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const boxe = await Boutique.find();
        res.json(boxe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const boxe = await Boutique.findById(req.params.id);
        if (!boxe) return res.status(404).json({ message: "Item introuvable" });
        res.json(boxe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const boxe = await Boutique.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!boxe) return res.status(404).json({ message: "Item introuvable" });
        res.json(boxe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const boxe = await Boutique.findByIdAndDelete(req.params.id);
        if (!boxe) return res.status(404).json({ message: "Item introuvable" });
        res.json({ message: "Item supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBoutiqueCPLByIdV2 = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Boutique.aggregate([
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
                $unwind: {
                    path: "$boxeInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
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
                $unwind: {
                    path: "$centreInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $lookup: {
                    from: "file",
                    let: { produitId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$produitId"] },
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
                    let: { produitId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$produitId"] },
                                idType: new mongoose.Types.ObjectId("699ad50b95739c29a87d14f9")
                            }
                        },
                        { $sort: { date: -1 } }, // 👈 TRI PAR DATE DÉCROISSANTE (plus récent d'abord)
                        { $limit: 1 } // 👈 PRENDRE SEULEMENT LA PREMIÈRE (la plus récente)
                    ],
                    as: "photoCouverture"
                }
            },
            {
                $lookup: {
                    from: "followers",
                    localField: "_id",
                    foreignField: "idUser",
                    as: "followerListe"
                }
            },
            {
                $project: {
                    _id: 1,
                    idDemandeLocation: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    nom: 1,
                    description: 1,
                    heure_ouverture: 1,
                    heure_fermeture: 1,
                    contact: 1,
                    email: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo",
                    pdp: {
                        $arrayElemAt: ["$photoPrincipale", 0]
                    },
                    pdc: {
                        $arrayElemAt: ["$photoCouverture", 0]
                    },
                    followers: "$followerListe"
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

exports.getBoutiqueCPLById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Boutique.aggregate([
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
                $unwind: {
                    path: "$boxeInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
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
                $unwind: {
                    path: "$centreInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $lookup: {
                    from: "file",
                    let: { produitId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$produitId"] },
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
                    let: { produitId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$produitId"] },
                                idType: new mongoose.Types.ObjectId("699ad50b95739c29a87d14f9")
                            }
                        },
                        { $sort: { date: -1 } }, // 👈 TRI PAR DATE DÉCROISSANTE (plus récent d'abord)
                        { $limit: 1 } // 👈 PRENDRE SEULEMENT LA PREMIÈRE (la plus récente)
                    ],
                    as: "photoCouverture"
                }
            },
            {
                $lookup: {
                    from: "followers",
                    localField: "_id",
                    foreignField: "idUser",
                    as: "followerListe"
                }
            },
            {
                $project: {
                    _id: 1,
                    idDemandeLocation: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    nom: 1,
                    description: 1,
                    heure_ouverture: 1,
                    heure_fermeture: 1,
                    contact: 1,
                    email: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo",
                    pdp: {
                        $arrayElemAt: ["$photoPrincipale", 0]
                    },
                    pdc: {
                        $arrayElemAt: ["$photoCouverture", 0]
                    },
                    followers: "$followerListe"
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

exports.getBoutiqueByIdProprietaire = async (req, res) => {
    try {
        const { idProprietaire } = req.params;

        const result = await Boutique.aggregate([
            {
                $match: {
                    idProprietaire: idProprietaire
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
                $unwind: {
                    path: "$boxeInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
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
                $unwind: {
                    path: "$centreInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $project: {
                    _id: 1,
                    idDemandeLocation: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    nom: 1,
                    description: 1,
                    heure_ouverture: 1,
                    heure_fermeture: 1,
                    contact: 1,
                    email: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBoutiqueByIdCentreCommercial = async (req, res) => {
    try {
        const { idCentreCommercial } = req.params;

        const result = await Boutique.aggregate([
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
                    let: { produitId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$produitId"] },
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
                    let: { produitId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$idProprietaire", "$$produitId"] },
                                idType: new mongoose.Types.ObjectId("699ad50b95739c29a87d14f9")
                            }
                        },
                        { $sort: { date: -1 } }, // 👈 TRI PAR DATE DÉCROISSANTE (plus récent d'abord)
                        { $limit: 1 } // 👈 PRENDRE SEULEMENT LA PREMIÈRE (la plus récente)
                    ],
                    as: "photoCouverture"
                }
            },
            {
                $lookup: {
                    from: "followers",
                    localField: "_id",
                    foreignField: "idUser",
                    as: "followerListe"
                }
            },
            {
                $project: {
                    _id: 1,
                    idDemandeLocation: 1,
                    idBoxe: 1,
                    idProprietaire: 1,
                    nom: 1,
                    description: 1,
                    heure_ouverture: 1,
                    heure_fermeture: 1,
                    contact: 1,
                    email: 1,
                    status: 1,
                    date:1,
                    proprietaire:"$proprietaireInfo",
                    boxe:"$boxeInfo",
                    centreCommercial:"$centreInfo",
                    pdp: {
                        $arrayElemAt: ["$photoPrincipale", 0]
                    },
                    pdc: {
                        $arrayElemAt: ["$photoCouverture", 0]
                    },
                    followers: "$followerListe"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.fermerBoutique = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Boutique.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.status = ConstanteEtat.OCCUPEE;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.ouvrirBoutique = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Boutique.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.status = ConstanteEtat.DISPONIBLE;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
