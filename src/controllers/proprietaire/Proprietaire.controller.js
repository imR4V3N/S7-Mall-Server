const Proprietaire = require("../../models/proprietaire/Proprietaire.model");
const Role = require("../../models/authentification/Role.model");
const Authentification = require("../../models/authentification/Authentification.model");

exports.create = async (req, res) => {
    try {
        const { identifiant, mdp, ...itemData } = req.body;
        if (!identifiant || !mdp) {
            return res.status(400).json({ erreura: "identifiant et mdp requis" });
        }
        if (identifiant && mdp) {
            const old_auth = await Authentification.find({ identifiant:identifiant });
            if (old_auth && old_auth.length > 0) {
                return res.status(400).json({ message: "Identifiant invalide" });
            }
        }
        const item = new Proprietaire(itemData);
        await item.save();

        const role = await Role.findById("698eea244745979d464f47b3"); // rôle "centre commercial"
        const auth = new Authentification({
            idUser: item._id,
            idRole: role._id, // rôle "centre commercial"
            identifiant,
            mdp // sera hashé automatiquement par le hook 'pre save'
        });
        await auth.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const item = await Proprietaire.find();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await Proprietaire.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { identifiant, mdp, ...itemData } = req.body;
        let auth = await Authentification.findOne({ idUser: req.params.id });
        if (identifiant && auth.identifiant!==identifiant) {
            const old_auth = await Authentification.find({ identifiant:identifiant });
            if (old_auth && old_auth.length > 0) {
                return res.status(400).json({ message: "Identifiant invalide" });
            }
        }
        if (identifiant) {
            auth.identifiant = identifiant;
        }
        if (mdp && mdp.trim() !== "") {
            auth.mdp = mdp; // sera hashé automatiquement par le hook 'pre save'
        }
        await auth.save();

        const item = await Proprietaire.findByIdAndUpdate(req.params.id, itemData, { new: true });
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
