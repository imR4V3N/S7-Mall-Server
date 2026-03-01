const Authentification = require("../../../models/authentification/Authentification.model");
const Role = require("../../../models/authentification/Role.model");
const Manager = require("../../../models/proprietaire/manager/Manager.model");
exports.create = async (req, res) => {
    try {
        const { identifiant, mdp, ...itemData } = req.body;

        if (identifiant && mdp) {
            const old_auth = await Authentification.find({ identifiant:identifiant });
            if (old_auth && old_auth.length > 0) {
                return res.status(400).json({ message: "Identifiant invalide" });
            }
        }

        const item = new Manager(itemData);
        await item.save();

        if (identifiant && mdp) {
            const role = await Role.findById("6999edcb2f77539972d1fac5"); // rôle "centre commercial"
            const auth = new Authentification({
                idUser: item._id,
                idRole: role._id,
                identifiant,
                mdp // sera hashé automatiquement par le hook 'pre save'
            });
            await auth.save();
        }
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
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

        const item = await Manager.findByIdAndUpdate(req.params.id, itemData, { new: true });
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        let auth = await Authentification.findOne({ idUser: req.params.id });
        if (auth) {
            await auth.delete();
        }
        const item = await Manager.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json({ message: "Item supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await Manager.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllByIdProprietaire = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Manager.aggregate([
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
                $match: {
                    "boutiqueInfo.idProprietaire": id
                }
            },
            {
                $lookup: {
                    from: "authentification",
                    localField: "_id",
                    foreignField: "idUser",
                    as: "authInfo"
                }
            },
            {
                $unwind: "$authInfo"
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
                $unwind: {
                    path: "$boxeInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: {
                    path: "$centreInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoutique: 1,
                    nom: 1,
                    prenom: 1,
                    contact: 1,
                    email: 1,
                    status: 1,
                    date:1,
                    boutique:"$boutiqueInfo",
                    authentification:"$authInfo",
                    centreCommercial:"$centreInfo"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCPLById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Manager.aggregate([
            {
                $match: {
                    _id: id
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
                    from: "authentification",
                    localField: "_id",
                    foreignField: "idUser",
                    as: "authInfo"
                }
            },
            {
                $unwind: "$authInfo"
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
                $unwind: {
                    path: "$boxeInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: {
                    path: "$centreInfo",
                    preserveNullAndEmptyArrays: true  // Important pour les boutiques sans boxe
                }
            },
            {
                $project: {
                    _id: 1,
                    idBoutique: 1,
                    nom: 1,
                    prenom: 1,
                    contact: 1,
                    email: 1,
                    status: 1,
                    date:1,
                    boutique:"$boutiqueInfo",
                    authentification:"$authInfo",
                    centreCommercial:"$centreInfo"
                }
            }
        ]);
        if (result.length==0){
            res.status(404).json({message:"Item introuvable"})
        }
        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = req.query.status;
        const item = await Manager.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.status = status;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getAllByIdBoutique = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Manager.aggregate([
            {
                $match: {
                    idBoutique: id
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
                    from: "authentification",
                    localField: "_id",
                    foreignField: "idUser",
                    as: "authInfo"
                }
            },
            {
                $unwind: "$authInfo"
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
                $lookup: {
                    from: "centre_commercial",
                    localField: "boxeInfo.idCentreCommercial",
                    foreignField: "_id",
                    as: "centreInfo"
                }
            },
            {
                $unwind: "$centreInfo"
            },
            {
                $project: {
                    _id: 1,
                    idBoutique: 1,
                    nom: 1,
                    prenom: 1,
                    contact: 1,
                    email: 1,
                    status: 1,
                    date:1,
                    boutique:"$boutiqueInfo",
                    authentification:"$authInfo",
                    centreCommercial:"$centreInfo"
                }
            }
        ]);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
