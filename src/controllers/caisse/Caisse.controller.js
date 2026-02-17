const Caisse = require("../../models/caisse/Caisse.model");

exports.create = async (req, res) => {
    try {
        const caisse = new Caisse(req.body);
        await caisse.save();
        res.status(201).json(caisse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const caisse = await Caisse.find();
        res.json(caisse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const caisse = await Caisse.findById(req.params.id);
        if (!caisse) return res.status(404).json({ message: "Caisse introuvable" });
        res.json(caisse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const caisse = await Caisse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!caisse) return res.status(404).json({ message: "Caisse introuvable" });
        res.json(caisse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.delete = async (req, res) => {
    try {
        const caisse = await Caisse.findByIdAndDelete(req.params.id);
        if (!caisse) return res.status(404).json({ message: "Caisse introuvable" });
        res.json({ message: "Caisse supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllByIdProprietaire = async (req, res) => {
    try {
        const { idProprietaire } = req.params;
        const caisse = await Caisse.find({ idProprietaire: idProprietaire });
        res.json(caisse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
