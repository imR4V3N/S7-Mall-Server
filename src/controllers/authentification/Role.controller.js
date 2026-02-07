const Role = require("src/models/authentification/Role.model");


// 🔹 Créer un rôle
exports.create = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// 🔹 Récupérer tous les rôles
exports.findAll = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// 🔹 Récupérer un rôle par ID
exports.findById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Rôle introuvable" });
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

        const role = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({ message: "Rôle introuvable" });
        }

        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// 🔹 Supprimer un rôle
exports.remove = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Rôle introuvable" });
        }
        res.json({ message: "Rôle supprimé" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
