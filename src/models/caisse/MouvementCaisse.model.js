const mongoose = require('mongoose');

const prefixeId = "mvtCaisse_";

const mouvementCaisseSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idCaisse: {
            type: String,
            required: true
        },
        idSource: {
            type: String,
        },
        designation: {
            type: String,
        },
        debit: {
            type: Number,
            min: 0,
            default:0
        },
        credit: {
            type: Number,
            min: 0,
            default:0
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
        collection:"mouvement_caisse",
        timestamps:false
    }
);

mouvementCaisseSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("MouvementCaisse", mouvementCaisseSchema);

