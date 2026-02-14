const Item = require("../../models/fichier/FileType.model");


// 🔹 Créer un rôle
exports.create = async (req, res) => {
    try {
        const role = await Item.create(req.body);
        res.status(201).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// 🔹 Récupérer tous les rôles
exports.findAll = async (req, res) => {
    try {
        const roles = await Item.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// 🔹 Récupérer un rôle par ID
exports.findById = async (req, res) => {
    try {
        const role = await Item.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Item introuvable" });
        }
        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// 🔹 Mettre à jour un rôle
exports.update = async (req, res) => {
    try {
        delete req.body._id; // sécurité

        const role = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({ message: "Item introuvable" });
        }

        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// 🔹 Supprimer un rôle
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
