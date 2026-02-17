const mongoose = require("mongoose");

const prefixeId = "prod_";

const produitSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idBoutique: {
            type: String,
            required: true
        },
        idCategorie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categorie",
            required: true
        },
        nom: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
        },
        prix: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        quantite: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        status: {
            type:Number,
            default:1
        }
    },
    {
        collection:"produit",
        timestamps:true
    }
);

produitSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Produit", produitSchema);
