const mongoose = require("mongoose");

const prefixeId = "btq_";

const boutiqueSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idDemandeLocation: {
            type: String,
        },
        idBoxe: {
            type: String,
        },
        idProprietaire: {
            type: String,
            required: true
        },
        nom: {
            type: String,
            default:"Good Shop"
        },
        description: {
            type: String
        },
        heure_ouverture: {
            type: String, // ex: "08:00"
            default:"08:00",
            required: true
        },
        heure_fermeture: {
            type: String, // ex: "18:00"
            default:"18:00",
            required: true
        },
        contact: {
            type: String
        },
        email: {
            type: String,
        },
        status: {
            type: Number,
            default: 3
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "boutique",
        timestamps: true
    }
);

boutiqueSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Boutique", boutiqueSchema);
