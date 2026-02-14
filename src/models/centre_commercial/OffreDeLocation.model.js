const mongoose = require("mongoose");

const prefixeId = "ofl_";
const offreDeLocationSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idBoxe: {
            type: String,
            required: true
        },
        description:{
            type: String
        },
        montantLoyer: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: Number,
            default: 1
        }
    },
    {
        collection: "offre_de_location",
        timestamps: true // pour createdAt / updatedAt
    }
);

offreDeLocationSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("OffreDeLocation", offreDeLocationSchema);
