const Mere = require("../../../models/proprietaire/vente/Vente.model");
const Fille = require("../../../models/proprietaire/vente/VenteDetails.model");
const Stock = require("../../../models/proprietaire/stock/Stock.model");
const StockDetails = require("../../../models/proprietaire/stock/StockDetails.model");
const {ConstanteEtat} = require("../../../config/constante");
const Produit = require("../../../models/proprietaire/produit/Produit.model");
const {VenteEntity} = require("../../../models/proprietaire/vente/Vente.model");

exports.insertMereFille = async (req, res) => {
    try {
        const {mere , filles} = req.body;

        const item = new Mere(mere);
        await item.save();

        for (const fille of filles) {
            const newItem = new Fille(fille);
            newItem.idMere = item._id;
            await newItem.save();
        }

        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateMereFille = async (req, res) => {
    try {
        const idMere = req.params.id;
        const { mere, filles } = req.body;

        // Validation
        if (!mere || !filles || !Array.isArray(filles)) {
            return res.status(400).json({
                message: "Données invalides"
            });
        }

        // Mettre à jour le parent
        const item = await Mere.findByIdAndUpdate(
            idMere,
            mere,
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: "Item introuvable" });
        }

        // Traiter les variantes
        const fillesIds = filles.filter(f => f._id).map(f => f._id);

        for (const fille of filles) {
            if (fille._id) {
                // Mise à jour d'une fille existante
                await Fille.findByIdAndUpdate(
                    fille._id,
                    fille,
                    { new: true, runValidators: true }
                );
            } else {
                // Création d'une nouvelle fille
                const newItem = new Fille(fille);
                newItem.idMere = idMere;
                await newItem.save();
                fillesIds.push(newItem._id); // Ajouter l'ID de la nouvelle fille à la liste
            }
        }

        // Supprimer les filles qui ne sont plus dans la liste
        await Fille.deleteMany({
            idMere: idMere,
            _id: { $nin: fillesIds }
        });

        res.json(item);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteMereEtFilles = async (req, res) => {
    try {
        const idMere = req.params.id;

        // Vérifier si la mère existe
        const mere = await Mere.findById(idMere);
        if (!mere) {
            return res.status(404).json({ message: "Mere non trouvé" });
        }

        // Supprimer d'abord toutes les filles (détails)
        const resultatFilles = await Fille.deleteMany({ idMere: idMere });

        // Puis supprimer la mère
        const resultatMere = await Mere.findByIdAndDelete(idMere);

        res.json({
            success: true,
            message: "Suppression réussie",
            details: {
                mereSupprimee: resultatMere,
                nombreFillesSupprimees: resultatFilles.deletedCount
            }
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const item = await Mere.find();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Mere.aggregate([
            {
                $match: {
                    "_id": id
                }
            },
            {
                $lookup: {
                    from: "client",
                    localField: "idClient",
                    foreignField: "_id",
                    as: "clientInfo"
                }
            },
            {
                $unwind: "$clientInfo"
            },
            {
                $lookup: {
                    from: "vente_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $addFields: {
                    montantTotal: {
                        $sum: {
                            $map: {
                                input: "$filles",
                                as: "fille",
                                in: {
                                    $subtract: [
                                        { $multiply: ["$$fille.prixUnitaire", "$$fille.quantite"] },
                                        { $multiply: [{ $ifNull: ["$$fille.remise", 0] }, "$$fille.quantite"] }
                                    ]
                                }
                            }
                        }
                    },
                    quantiteTotal: {
                        $sum: "$filles.quantite"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoutique: 1,
                    idClient: 1,
                    designation: 1,
                    date: 1,
                    status:1,
                    montantTotal: 1,
                    quantiteTotal:1,
                    client: "$clientInfo",
                    filles: "$filles"
                }
            }
        ]);

        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdBoutique = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Mere.aggregate([
            {
                $match: {
                    "idBoutique": id
                }
            },
            {
                $lookup: {
                    from: "client",
                    localField: "idClient",
                    foreignField: "_id",
                    as: "clientInfo"
                }
            },
            {
                $unwind: "$clientInfo"
            },
            {
                $lookup: {
                    from: "vente_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $addFields: {
                    montantTotal: {
                        $sum: {
                            $map: {
                                input: "$filles",
                                as: "fille",
                                in: {
                                    $subtract: [
                                        { $multiply: ["$$fille.prixUnitaire", "$$fille.quantite"] },
                                        { $multiply: [{ $ifNull: ["$$fille.remise", 0] }, "$$fille.quantite"] }
                                    ]
                                }
                            }
                        }
                    },
                    quantiteTotal: {
                        $sum: "$filles.quantite"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoutique: 1,
                    idClient: 1,
                    designation: 1,
                    date: 1,
                    status:1,
                    montantTotal: 1,
                    quantiteTotal:1,
                    client: "$clientInfo",
                    filles: "$filles"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFilleByIdMere = async (req, res) => {
    try {
        const { idMere } = req.params;

        const result = await Fille.aggregate([
            {
                $match: {
                    "idMere": idMere
                }
            },
            {
                $lookup: {
                    from: "produit",
                    localField: "idProduit",
                    foreignField: "_id",
                    as: "produitDetails"
                }
            },
            {
                $unwind: "$produitDetails"
            },
            {
                $addFields: {
                    montantTotal: {
                        $subtract: [
                            { $multiply: ["$prixUnitaire", "$quantite"] },
                            { $multiply: [{ $ifNull: ["$remise", 0] }, "$quantite"] }
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    idMere: 1,
                    idProduit: 1,
                    quantite: 1,
                    prixUnitaire: 1,
                    remarque:1,
                    remise:1,
                    montantTotal:1,
                    produit: "$produitDetails"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.valider = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Mere.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });

        // await VenteEntity.genererMouvementStock(item,null);

        item.status = ConstanteEtat.VALIDER;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
