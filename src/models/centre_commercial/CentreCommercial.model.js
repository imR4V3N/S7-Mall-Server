const mongoose = require("mongoose");

const prefixeId = "cc_"
const centreCommercialSchema = new mongoose.Schema(
    {
        _id : {
            type: String
        },

        nom: {
            type: String,
            required: true,
            trim: true
        },

        adresse: {
            type: String,
            required: true
        },

        date_creation: {
            type: Date,
            default: Date.now
        },

        isOuvert: {
            type: Boolean,
            default: false
        },

        heure_ouverture: {
            type: String, // ex: "08:00"
            required: true
        },

        heure_fermeture: {
            type: String, // ex: "18:00"
            required: true
        }
    },
    {
        collection: "centre_commercial",
        timestamps: false,
        _id: false
    }
);

centreCommercialSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

// module.exports = mongoose.model(
//     "CentreCommercial",
//     centreCommercialSchema
// );

// Vérifier si le modèle existe déjà avant de le créer
const CentreCommercial = mongoose.models.CentreCommercial
    || mongoose.model('CentreCommercial', centreCommercialSchema);

module.exports = CentreCommercial;
