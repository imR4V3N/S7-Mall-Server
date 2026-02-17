const mongoose = require("mongoose");

const prefixeId = "vd_";

const venteDetailsSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idMere: {
            type: String,
            required: true
        },
        idProduit: {
            type: String,
            required: true
        },
        quantite: {
            type: Number,
            required: true,
            default:0
        },
        prixUnitaire: {
            type: Number,
            required: true,
            default:0
        },
        remarque: {
            type: String,
        },
        remise: {
            type: Number,
            default: 0
        }
    },
    {
        collection:"vente_details",
        timestamps:false
    }
);

venteDetailsSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("VenteDetails", venteDetailsSchema);
