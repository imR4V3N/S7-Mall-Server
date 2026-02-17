const Stock = require("../../../models/proprietaire/stock/Stock.model");
const StockDetails = require("../../../models/proprietaire/stock/StockDetails.model");
const Produit = require("../../../models/proprietaire/produit/Produit.model");
const mongoose = require("mongoose");
const {ConstanteEtat} = require("../../../config/constante");

exports.create = async (req, res) => {
    try {
        const item = new Stock(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.insertMereFille = async (req, res) => {
    try {
        const {mere , filles} = req.body;

        const item = new Stock(mere);
        await item.save();

        for (const fille of filles) {
            const newItem = new StockDetails(fille);
            newItem.idMere = item._id;
            await newItem.save();
        }

        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// UPDATE
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
        const item = await Stock.findByIdAndUpdate(
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
                await StockDetails.findByIdAndUpdate(
                    fille._id,
                    fille,
                    { new: true, runValidators: true }
                );
            } else {
                // Création d'une nouvelle fille
                const newItem = new StockDetails(fille);
                newItem.idMere = idMere;
                await newItem.save();
                fillesIds.push(newItem._id); // Ajouter l'ID de la nouvelle fille à la liste
            }
        }

        // Supprimer les filles qui ne sont plus dans la liste
        await StockDetails.deleteMany({
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
        const mere = await Stock.findById(idMere);
        if (!mere) {
            return res.status(404).json({ message: "Stock non trouvé" });
        }

        // Supprimer d'abord toutes les filles (détails)
        const resultatFilles = await StockDetails.deleteMany({ idMere: idMere });

        // Puis supprimer la mère
        const resultatMere = await Stock.findByIdAndDelete(idMere);

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
        const item = await Stock.find();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Stock.aggregate([
            {
                $match: {
                    "_id": id
                }
            },
            {
                $lookup: {
                    from: "stock_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $project: {
                    _id: 1,
                    idSource:1,
                    idBoutique: 1,
                    idTypeMvtStock: 1,
                    designation: 1,
                    date: 1,
                    status:1,
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
        const { idBoutique } = req.params;

        const result = await Stock.aggregate([
            {
                $match: {
                    "idBoutique": idBoutique
                }
            },
            {
                $lookup: {
                    from: "stock_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoutique: 1,
                    idTypeMvtStock: 1,
                    designation: 1,
                    date: 1,
                    status:1,
                    filles: "$filles"
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
        const status = ConstanteEtat.VALIDER;
        const item = await Stock.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });

        // Récupérer tous les détails du stock
        const stockDetails = await StockDetails.find({ idMere: id });

        // Regrouper les entree/sortie par produit
        const totalsByProduit = new Map();
        for (const detail of stockDetails) {
            const key = String(detail.idProduit);
            const current = totalsByProduit.get(key) || { entree: 0, sortie: 0 };
            totalsByProduit.set(key, {
                entree: current.entree + (detail.entree || 0),
                sortie: current.sortie + (detail.sortie || 0),
            });
        }

        let listProduits = [];
        for (const [idProduit, totals] of totalsByProduit.entries()) {
            const produit = await Produit.findById(idProduit);
            if (!produit) continue;

            const quantiteInitiale = produit.quantite || 0;
            const quantiteApresEntree = quantiteInitiale + (totals.entree || 0);

            if ((totals.sortie || 0) > 0 && quantiteApresEntree < totals.sortie) {
                return res.status(404).json({ message: `Quantité insuffisante pour le produit ${produit.nom}` });
            }

            produit.quantite = quantiteApresEntree - (totals.sortie || 0);
            listProduits.push(produit);
        }

        // Mettre à jour la quantité de chaque produit
        for (const produit of listProduits) {
            await produit.save();
        }

        item.status = status;
        await item.save();

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStockDetailsByIdMere = async (req, res) => {
    try {
        const { idMere } = req.params;

        const result = await StockDetails.aggregate([
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
                $project: {
                    _id: 1,
                    idMere: 1,
                    idProduit: 1,
                    entree: 1,
                    sortie: 1,
                    remarque:1,
                    produit: "$produitDetails"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdSource = async (req, res) => {
    try {
        const { idSource } = req.params;

        const result = await Stock.aggregate([
            {
                $match: {
                    "idSource": idSource
                }
            },
            {
                $lookup: {
                    from: "stock_details",
                    localField: "_id",
                    foreignField: "idMere",
                    as: "filles"
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoutique: 1,
                    idTypeMvtStock: 1,
                    designation: 1,
                    date: 1,
                    status:1,
                    filles: "$filles"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
