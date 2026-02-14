const Proprietaire = require("../../models/proprietaire/Proprietaire.model");
const Role = require("../../models/authentification/Role.model");
const Authentification = require("../../models/authentification/Authentification.model");

exports.create = async (req, res) => {
    try {
        const { identifiant, mdp, ...itemData } = req.body;
        if (!identifiant || !mdp) {
            return res.status(400).json({ erreura: "identifiant et mdp requis" });
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
