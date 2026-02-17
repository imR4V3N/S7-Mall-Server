const Produit = require("../../../models/proprietaire/produit/Produit.model");
const ProduitVariante = require("../../../models/proprietaire/produit/ProduitVariante.model");
const {ConstanteEtat} = require("../../../config/constante");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
    try {
        const item = new Produit(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.insertMereFille = async (req, res) => {
    try {
        const {mere , filles} = req.body;

        const item = new Produit(mere);
        await item.save();

        for (const fille of filles) {
            const newItem = new ProduitVariante(fille);
            newItem.idProduit = item._id;
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
        const item = await Produit.findByIdAndUpdate(
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
                await ProduitVariante.findByIdAndUpdate(
                    fille._id,
                    fille,
                    { new: true, runValidators: true }
                );
            } else {
                // Création d'une nouvelle fille
                const newItem = new ProduitVariante(fille);
                newItem.idProduit = idMere;
                await newItem.save();
                fillesIds.push(newItem._id); // Ajouter l'ID de la nouvelle fille à la liste
            }
        }

        // Supprimer les filles qui ne sont plus dans la liste
        await ProduitVariante.deleteMany({
            idProduit: idMere,
            _id: { $nin: fillesIds }
        });

        res.json(item);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const item = await Produit.find();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllByBoutique = async (req, res) => {
    try {
        const status = req.query.status;
        let item;
        if (status) {
            item = await Produit.find({idBoutique:req.params.id, status: parseInt(status)});
        }
        else{
            item = await Produit.find({idBoutique:req.params.id});
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProduitCplById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Produit.aggregate([
            {
                $match: {
                    "_id": id
                }
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
                $unwind: "$boutiqueInfo"
            },
            {
                $lookup: {
                    from: "categorie",
                    localField: "idCategorie",
                    foreignField: "_id",
                    as: "categorieInfo"
                }
            },
            {
                $unwind: "$categorieInfo"
            },
            {
                $lookup: {
                    from: "produit_variante",
                    localField: "_id",
                    foreignField: "idProduit",
                    as: "produitVariantes"
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
                    localField: "_id",
                    foreignField: "idProprietaire",
                    as: "toutesLesPhotos"
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoutique: 1,
                    idCategorie: 1,
                    nom: 1,
                    description: 1,
                    prix: 1,
                    quantite: 1,
                    status:1,
                    boutique: "$boutiqueInfo",
                    categorie: "$categorieInfo",
                    variantes: "$produitVariantes",
                    photo: {
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

exports.getProduitCplByIdBoutique = async (req, res) => {
    try {
        const { idBoutique } = req.params;
        const status = req.query.status;
        let result;
        if (status) {
            result = await Produit.aggregate([
                {
                    $match: {
                        "idBoutique": idBoutique,
                        "status": parseInt(status)
                    }
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
                    $unwind: "$boutiqueInfo"
                },
                {
                    $lookup: {
                        from: "categorie",
                        localField: "idCategorie",
                        foreignField: "_id",
                        as: "categorieInfo"
                    }
                },
                {
                    $unwind: "$categorieInfo"
                },
                {
                    $lookup: {
                        from: "produit_variante",
                        localField: "_id",
                        foreignField: "idProduit",
                        as: "produitVariantes"
                    }
                },
                {
                    $lookup: {
                        from: "file",
                        let: { produitId: "_id" },
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
                        localField: "_id",
                        foreignField: "idProprietaire",
                        as: "toutesLesPhotos"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        idBoutique: 1,
                        idCategorie: 1,
                        nom: 1,
                        description: 1,
                        prix: 1,
                        quantite: 1,
                        status:1,
                        boutique: "$boutiqueInfo",
                        categorie: "$categorieInfo",
                        variantes: "$produitVariantes",
                        photo: {
                            $arrayElemAt: ["$photoPrincipale", 0]
                        },
                        autrePhoto: "$toutesLesPhotos",
                    }
                }
            ]);
        }
        else {
            result = await Produit.aggregate([
                {
                    $match: {
                        "idBoutique": idBoutique
                    }
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
                    $unwind: "$boutiqueInfo"
                },
                {
                    $lookup: {
                        from: "categorie",
                        localField: "idCategorie",
                        foreignField: "_id",
                        as: "categorieInfo"
                    }
                },
                {
                    $unwind: "$categorieInfo"
                },
                {
                    $lookup: {
                        from: "produit_variante",
                        localField: "_id",
                        foreignField: "idProduit",
                        as: "produitVariantes"
                    }
                },
                {
                    $lookup: {
                        from: "file",
                        let: { produitId: "_id" },
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
                        localField: "_id",
                        foreignField: "idProprietaire",
                        as: "toutesLesPhotos"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        idBoutique: 1,
                        idCategorie: 1,
                        nom: 1,
                        description: 1,
                        prix: 1,
                        quantite: 1,
                        status:1,
                        boutique: "$boutiqueInfo",
                        categorie: "$categorieInfo",
                        variantes: "$produitVariantes",
                        photo: {
                            $arrayElemAt: ["$photoPrincipale", 0]
                        },
                        autrePhoto: "$toutesLesPhotos",
                    }
                }
            ]);
        }

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProduitCplByIdCentreCommercial = async (req, res) => {
    try {
        const { idCentreCommercial } = req.params;
        const status = req.query.status;
        let result;
        if (status){
            result = await Produit.aggregate([
                {
                    $match: {
                        "status": parseInt(status)
                    }
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
                    $unwind: "$boutiqueInfo"
                },
                {
                    $lookup: {
                        from: "boxe",
                        localField: "boutiqueInfo.idBoxe",
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
                        from: "categorie",
                        localField: "idCategorie",
                        foreignField: "_id",
                        as: "categorieInfo"
                    }
                },
                {
                    $unwind: "$categorieInfo"
                },
                {
                    $lookup: {
                        from: "produit_variante",
                        localField: "_id",
                        foreignField: "idProduit",
                        as: "produitVariantes"
                    }
                },
                {
                    $lookup: {
                        from: "file",
                        let: { produitId: "_id" },
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
                        localField: "_id",
                        foreignField: "idProprietaire",
                        as: "toutesLesPhotos"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        idBoutique: 1,
                        idCategorie: 1,
                        nom: 1,
                        description: 1,
                        prix: 1,
                        quantite: 1,
                        status:1,
                        boutique: "$boutiqueInfo",
                        categorie: "$categorieInfo",
                        variantes: "$produitVariantes",
                        photo: {
                            $arrayElemAt: ["$photoPrincipale", 0]
                        },
                        autrePhoto: "$toutesLesPhotos",
                    }
                }
            ]);
        }else {
            result = await Produit.aggregate([
                {
                    $lookup: {
                        from: "boutique",
                        localField: "idBoutique",
                        foreignField: "_id",
                        as: "boutiqueInfo"
                    }
                },
                {
                    $unwind: "$boutiqueInfo"
                },
                {
                    $lookup: {
                        from: "boxe",
                        localField: "boutiqueInfo.idBoxe",
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
                        from: "categorie",
                        localField: "idCategorie",
                        foreignField: "_id",
                        as: "categorieInfo"
                    }
                },
                {
                    $unwind: "$categorieInfo"
                },
                {
                    $lookup: {
                        from: "produit_variante",
                        localField: "_id",
                        foreignField: "idProduit",
                        as: "produitVariantes"
                    }
                },
                {
                    $lookup: {
                        from: "file",
                        let: { produitId: "_id" },
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
                        localField: "_id",
                        foreignField: "idProprietaire",
                        as: "toutesLesPhotos"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        idBoutique: 1,
                        idCategorie: 1,
                        nom: 1,
                        description: 1,
                        prix: 1,
                        quantite: 1,
                        status:1,
                        boutique: "$boutiqueInfo",
                        categorie: "$categorieInfo",
                        variantes: "$produitVariantes",
                        photo: {
                            $arrayElemAt: ["$photoPrincipale", 0]
                        },
                        autrePhoto: "$toutesLesPhotos",
                    }
                }
            ]);
        }

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = req.query.status;
        const item = await Produit.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.status = status;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
