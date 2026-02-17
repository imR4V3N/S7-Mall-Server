const mongoose = require('mongoose');

const prefixeId = "clt_";

const clientSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idBoutique: {
            type: String,
        },
        pdp: {
            type: String,
        },
        nom: {
            type: String,
        },
        prenom: {
            type: String,
            required: true,
        },
        adresse: {
            type: String,
        },
        contact: {
            type: String,
        },
        date_naissance: {
            type: Date,
            required:true
        },
        sexe: {
            type: String,
            values: ['Masculin', 'Feminin', 'Autre'],
        },
        status: {
            type: Number,
            default: 1
        }
    },
    {
        collection:"client",
        timestamps:false
    }
);

clientSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Client", clientSchema);
