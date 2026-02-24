const DemandeLocation = require("../../models/proprietaire/DemandeLocation.model");
const OffreDeLocation = require("../../models/centre_commercial/OffreDeLocation.model");
const Boutique = require("../../models/proprietaire/Boutique.model");
const Boxe = require("../../models/centre_commercial/Boxe.model")
const mongoose = require("mongoose");
const {ConstanteEtat} = require("../../config/constante");
const LocationBoxe = require("../../models/proprietaire/LocationBoxe.model");
const Notification = require("../../models/notification/Notification.model");
const CentreCommercial = require("../../models/centre_commercial/CentreCommercial.model")
const Proprietaire = require("../../models/proprietaire/Proprietaire.model")

exports.create = async (req, res) => {
    try {
        const item = new DemandeLocation(req.body);
        await item.save();
        const offre = await OffreDeLocation.findById(item.idOffreLocation);
        const boxe = await Boxe.findById(offre.idBoxe);
        const proprietaire = await Proprietaire.findById(item.idProprietaire);

        const notification = new Notification({
            idUser: boxe.idCentreCommercial,
            title: "Nouvelle Demande de location",
            message: `Vous avez reçu une nouvelle demande de location pour le boxe ${boxe.nom} venant de ${proprietaire.nom} ${proprietaire.prenom}.`,
            lien: `owner/demandeLocation/`,
            badge: "<div class=\"notification-icon\" style=\"background-color: #dbeafe;color: #3b82f6;\">\n" +
                "                    <i class=\"fa fa-info-circle\"></i>\n" +
                "                  </div>",
        });
        await notification.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const item = await DemandeLocation.find();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await DemandeLocation.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await DemandeLocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. NETTOIE L'ID (supprime espaces, retours à la ligne)
        const cleanId = id.toString().trim();

        const item = await DemandeLocation.findOneAndDelete({
            _id: {
                $eq: cleanId,           // Égalité stricte
                $type: "string"         // Force le type string
            }
        });
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        res.json({ message: "Item supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getDemandeByCentre = async (req, res) => {
    try {
        const { idCentreCommercial } = req.params;

        const result = await DemandeLocation.aggregate([
            {
                $lookup: {
                    from: "proprietaire",
                    localField: "idProprietaire",
                    foreignField: "_id",
                    as: "proprietaireInfo"
                }
            },
            {
                $unwind: "$proprietaireInfo"
            },
            {
                $lookup: {
                    from: "offre_de_location",
                    localField: "idOffreLocation",
                    foreignField: "_id",
                    as: "offreInfo"
                }
            },
            {
                $unwind: "$offreInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "offreInfo.idBoxe",
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
                $project: {
                    _id: 1,
                    idOffreLocation: 1,
                    idProprietaire:1,
                    montantLoyer: 1,
                    date: 1,
                    status: 1,
                    offre: "$offreInfo",
                    boxe: "$boxeInfo",
                    proprietaire:"$proprietaireInfo"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDemandeCPLById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await DemandeLocation.aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $lookup: {
                    from: "proprietaire",
                    localField: "idProprietaire",
                    foreignField: "_id",
                    as: "proprietaireInfo"
                }
            },
            {
                $unwind: "$proprietaireInfo"
            },
            {
                $lookup: {
                    from: "offre_de_location",
                    localField: "idOffreLocation",
                    foreignField: "_id",
                    as: "offreInfo"
                }
            },
            {
                $unwind: "$offreInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "offreInfo.idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $project: {
                    _id: 1,
                    idOffreLocation: 1,
                    idProprietaire:1,
                    montantLoyer: 1,
                    date: 1,
                    status: 1,
                    offre: "$offreInfo",
                    boxe: "$boxeInfo",
                    proprietaire:"$proprietaireInfo"
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

exports.getDemandeByProprietaire = async (req, res) => {
    try {
        const { idProprietaire } = req.params;

        const result = await DemandeLocation.aggregate([
            {
                $match: {
                    idProprietaire: idProprietaire
                }
            },
            {
                $lookup: {
                    from: "offre_de_location",
                    localField: "idOffreLocation",
                    foreignField: "_id",
                    as: "offreInfo"
                }
            },
            {
                $unwind: "$offreInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "offreInfo.idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $project: {
                    _id: 1,
                    idOffreLocation: 1,
                    idProprietaire:1,
                    montantLoyer: 1,
                    date: 1,
                    status: 1,
                    offre: "$offreInfo",
                    boxe: "$boxeInfo"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDemandeByOffre = async (req, res) => {
    try {
        const { idOffreLocation } = req.params;

        const result = await DemandeLocation.aggregate([
            {
                $match: {
                    idOffreLocation: idOffreLocation
                }
            },
            {
                $lookup: {
                    from: "proprietaire",
                    localField: "idProprietaire",
                    foreignField: "_id",
                    as: "proprietaireInfo"
                }
            },
            {
                $unwind: "$proprietaireInfo"
            },
            {
                $lookup: {
                    from: "offre_de_location",
                    localField: "idOffreLocation",
                    foreignField: "_id",
                    as: "offreInfo"
                }
            },
            {
                $unwind: "$offreInfo"
            },
            {
                $lookup: {
                    from: "boxe",
                    localField: "offreInfo.idBoxe",
                    foreignField: "_id",
                    as: "boxeInfo"
                }
            },
            {
                $unwind: "$boxeInfo"
            },
            {
                $project: {
                    _id: 1,
                    idOffreLocation: 1,
                    idProprietaire:1,
                    montantLoyer: 1,
                    date: 1,
                    status: 1,
                    offre: "$offreInfo",
                    boxe: "$boxeInfo",
                    proprietaire:"$proprietaireInfo"
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.accepterDemande = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await DemandeLocation.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.status = ConstanteEtat.VALIDER;
        const offre = await OffreDeLocation.findById(item.idOffreLocation);
        offre.status = ConstanteEtat.OCCUPEE;
        const boxe = await Boxe.findById(offre.idBoxe);
        boxe.status = ConstanteEtat.OCCUPEE;
        await item.save();
        await offre.save();
        await boxe.save();

        const locationBody = {
            idProprietaire: item.idProprietaire,
            idBoxe: offre.idBoxe
        }
        const newLocation = new LocationBoxe(locationBody);
        await newLocation.save();

        const centre = await CentreCommercial.findById(boxe.idCentreCommercial);
        const notification = new Notification({
            idUser: item.idProprietaire,
            title: "Demande de location accepté",
            message: `Votre demande de location pour le boxe ${boxe.nom} du centre commercial ${centre.nom} a ete accepter`,
            lien: `owner/location_boxe/details/${newLocation._id}`,
            badge: "<div class=\"notification-icon\" style=\"background-color: #dcfce7;color: #22c55e;\">\n" +
                "                    <i class=\"fa fa-check-circle\"></i>\n" +
                "                  </div>",
        });
        await notification.save();

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rejeterDemande = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await DemandeLocation.findById(id);
        if (!item) return res.status(404).json({ message: "Item introuvable" });
        item.status = ConstanteEtat.REJETER;
        await item.save();
        const offre = await OffreDeLocation.findById(item.idOffreLocation);
        const boxe = await Boxe.findById(offre.idBoxe);
        const centre = await CentreCommercial.findById(boxe.idCentreCommercial);
        const notification = new Notification({
            idUser: item.idProprietaire,
            title: "Demande de location rejeter",
            message: `Votre demande de location pour le boxe ${boxe.nom} du centre commercial ${centre.nom} a ete rejeter`,
            lien: `owner/demandeLocation/`,
            badge: "<div class=\"notification-icon\" style=\"background-color: #fee2e2;color: #ef4444;\">\n" +
                "                    <i class=\"fa fa-times-circle\"></i>\n" +
                "                  </div>",
        });
        await notification.save();

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
