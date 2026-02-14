const mongoose = require("mongoose");

const prefixeId = "pr_";
const proprietaireSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        pdp: {
            type: String,
        },
        nom: {
            type: String,
            trim: true
        },
        prenom: {
            type: String,
            trim: true
        },
        adresse: {
            type: String,
            required: true
        },
        telephone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        date_naissance: {
            type: Date,
            required: true
        },
        date : {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "proprietaire",
        timestamps: true // pour createdAt / updatedAt
    }
);

proprietaireSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Proprietaire", proprietaireSchema);
