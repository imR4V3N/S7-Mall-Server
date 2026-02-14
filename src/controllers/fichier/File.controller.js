const Item = require("../../models/fichier/File.model");
const mongoose = require("mongoose");
const Authentification = require("../../models/authentification/Authentification.model");

// 🔹 Créer un compte
exports.create = async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(auth);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.createMultiple = async (req, res) => {
    try {
        const items = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({ error: "Tableau attendu" });
        }

        const results = {
            success: [],
            errors: []
        };

        // Traitement un par un pour plus de contrôle
        for (const item of items) {
            try {
                const newItem = new Item(item);
                await newItem.save();
                results.success.push(newItem);
            } catch (err) {
                results.errors.push({
                    item: item,
                    error: err.message
                });
            }
        }

        res.status(201).json({
            message: `${results.success.length} créé(s), ${results.errors.length} erreur(s)`,
            results: results
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const data = await Item.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findById = async (req, res) => {
    try {
        console.log("ID recherché:", req.params.id);
        const auth = await Item.findById(req.params.id);
        if (!auth) return res.status(404).json({ message: "Introuvable" });
        const result = await Item.aggregate([
            { $match: { _id: auth._id } }, // on match l'utilisateur trouvé
            {
                $lookup: {
                    from: "file_type",
                    localField: "idType",
                    foreignField: "_id",
                    as: "filetype"
                }
            },
            { $unwind: "$filetype" },
            {
                $project: {
                    _id: 1,
                    nom: 1,
                    url: 1,
                    idType: 1,
                    idProprietaire:1,
                    date:1,
                    fileType: { val: "$filetype.val", desce: "$filetype.desce" }
                }
            }
        ]);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.findByIdProprietaireAndType = async (req, res) => {
    try {
        const { idProprietaire } = req.params;
        const type = req.query.type;
        console.log("idProprietaire:", idProprietaire);
        console.log("type:", type);
        let result;

        if (type){
            result = await Item.aggregate([
                { $match: { idProprietaire: idProprietaire } }, // on match l'utilisateur trouvé
                {
                    $lookup: {
                        from: "file_type",
                        localField: "idType",
                        foreignField: "_id",
                        as: "filetype"
                    }
                },
                { $unwind: "$filetype" },
                { $match: { "filetype.val": type } }, // on match l'utilisateur trouvé
                { $sort: { date: -1 } },
                {
                    $project: {
                        _id: 1,
                        nom: 1,
                        url: 1,
                        idType: 1,
                        idProprietaire:1,
                        date:1,
                        fileType: { val: "$filetype.val", desce: "$filetype.desce" }
                    }
                }
            ]);
        }else {
            result = await Item.aggregate([
                { $match: { idProprietaire: idProprietaire } }, // on match l'utilisateur trouvé
                {
                    $lookup: {
                        from: "file_type",
                        localField: "idType",
                        foreignField: "_id",
                        as: "filetype"
                    }
                },
                { $unwind: "$filetype" },
                { $sort: { date: -1 } },
                {
                    $project: {
                        _id: 1,
                        nom: 1,
                        url: 1,
                        idType: 1,
                        idProprietaire:1,
                        date:1,
                        fileType: { val: "$filetype.val", desce: "$filetype.desce" }
                    }
                }
            ]);
        }
        if (!result) return res.status(404).json({ message: "Tay" || idProprietaire });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const role = await Item.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Item introuvable" });
        }
        res.json({ message: "Item supprimé" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
