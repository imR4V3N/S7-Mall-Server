const mongoose = require('mongoose');

const prefixeId = "caisse_";

const caisseSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idProprietaire: {
            type: String,
            required: true
        },
        nom: {
            type: String,
            required: true,
            trim: true
        },
        numero_compte: {
            type: String,
            required: true,
            trim: true
        },
        total_debit: {
            type: Number,
            default: 0
        },
        total_credit: {
            type: Number,
            default: 0
        },
        solde: {
            type: Number,
            default: 0
        },
        status: {
            type: Number,
            default: 1
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection:"caisse",
        timestamps:false
    }
);

caisseSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Caisse", caisseSchema);
