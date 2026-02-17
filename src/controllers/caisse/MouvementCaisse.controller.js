const Caisse = require("../../models/caisse/Caisse.model");
const MouvementCaisse = require("../../models/caisse/MouvementCaisse.model");
const {ConstanteEtat} = require("../../config/constante");
const {MouvementCaisseService} = require("../../services/caisse/MouvementCaisse.service");

exports.create = async (req, res) => {
    try {
        const item = new MouvementCaisse(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const caisse = await MouvementCaisse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!caisse) return res.status(404).json({ message: "Item introuvable" });
        res.json(caisse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const caisse = await MouvementCaisse.findByIdAndDelete(req.params.id);
        if (!caisse) return res.status(404).json({ message: "Item introuvable" });
        res.json({ message: "Item supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const caisse = await MouvementCaisse.find();
        res.json(caisse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllByIdCaisse = async (req, res) => {
    try {
        const {idCaisse} = req.params;
        const caisse = await MouvementCaisse.find({idCaisse: idCaisse});
        res.json(caisse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getById = async (req, res) => {
    try {
        const caisse = await MouvementCaisse.findById(req.params.id);
        if (!caisse) return res.status(404).json({ message: "Item introuvable" });
        res.json(caisse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await MouvementCaisse.aggregate([
            {
                $match: {
                    "_id": id
                }
            },
            {
                $lookup: {
                    from: "caisse",
                    localField: "idCaisse",
                    foreignField: "_id",
                    as: "caisseInfo"
                }
            },
            {
                $unwind: "$caisseInfo"
            },
            {
                $project: {
                    _id: 1,
                    idCaisse:1,
                    idSource:1,
                    designation: 1,
                    debit: 1,
                    credit: 1,
                    status:1,
                    date: 1,
                    caisse: "$caisseInfo"
                }
            }
        ]);

        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCplByIdProprietaire = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await MouvementCaisse.aggregate([
            {
                $lookup: {
                    from: "caisse",
                    localField: "idCaisse",
                    foreignField: "_id",
                    as: "caisseInfo"
                }
            },
            {
                $unwind: "$caisseInfo"
            },
            {
                $match: {
                    "caisseInfo.idProprietaire": id
                }
            },
            {
                $project: {
                    _id: 1,
                    idCaisse:1,
                    idSource:1,
                    designation: 1,
                    debit: 1,
                    credit: 1,
                    status:1,
                    date: 1,
                    caisse: "$caisseInfo"
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
        const item = await MouvementCaisse.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });

        await MouvementCaisseService.valider(item);

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
