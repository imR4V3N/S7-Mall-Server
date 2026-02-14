const Authentification = require("../../models/authentification/Authentification.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


// 🔹 Créer un compte
exports.create = async (req, res) => {
    try {
        const auth = await Authentification.create(req.body);
        res.status(201).json(auth);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// 🔹 Récupérer tous les comptes
exports.findAll = async (req, res) => {
    try {
        const data = await Authentification.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// 🔹 Récupérer un compte par ID
exports.findById = async (req, res) => {
    try {
        const auth = await Authentification.findById(req.params.id);
        if (!auth) return res.status(404).json({ message: "Introuvable" });
        res.json(auth);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 🔹 Récupérer un compte par idUser
exports.findByIdUser = async (req, res) => {
    try {
        const auth = await Authentification.findOne({ idUser: req.params.idUser });
        if (!auth) return res.status(404).json({ message: "Introuvable" });
        res.json(auth);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 🔹 Récupérer un compte par identifiant et mot de passe

exports.loginWithRole = async (req, res) => {
    try {
        const { identifiant, mdp } = req.body; // en POST body

        // 1️⃣ Récupérer l'utilisateur par identifiant
        const auth = await Authentification.findOne({ identifiant });
        if (!auth) return res.status(404).json({ message: "Utilisateur introuvable" });

        // 2️⃣ Vérifier le mot de passe
        const isMatch = await bcrypt.compare(mdp, auth.mdp);
        if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

        // 3️⃣ Aggregation pour récupérer le rôle
        const result = await Authentification.aggregate([
            { $match: { _id: auth._id } }, // on match l'utilisateur trouvé
            {
                $lookup: {
                    from: "role",
                    localField: "idRole",
                    foreignField: "_id",
                    as: "role"
                }
            },
            { $unwind: "$role" },
            {
                $project: {
                    _id: 1,
                    idUser: 1,
                    identifiant: 1,
                    idRole: 1,
                    role: { val: "$role.val", desce: "$role.desce" }
                }
            }
        ]);

        res.json(result[0]); // résultat unique

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Mettre à jour
exports.update = async (req, res) => {
    try {
        delete req.body._id; // sécurité

        const auth = await Authentification.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!auth) return res.status(404).json({ message: "Introuvable" });
        res.json(auth);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// 🔹 Supprimer
exports.remove = async (req, res) => {
    try {
        const auth = await Authentification.findByIdAndDelete(req.params.id);
        if (!auth) return res.status(404).json({ message: "Introuvable" });
        res.json({ message: "Supprimé avec succès" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAuthWithRole = async (req, res) => {
    try {
        const data = await mongoose
            .connection
            .collection("v_authentification_role")
            .find()
            .toArray();

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
