const mongoose = require("mongoose");

const prefixeId = "stkd_";

const stockDetailsSchema = new mongoose.Schema(
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
        entree: {
            type: Number,
            default: 0,
            min: 0
        },
        sortie: {
            type: Number,
            default: 0,
            min: 0
        },
        remarque: {
            type: String,
            trim: true
        }
    },
    {
        collection:"stock_details",
        timestamps:false
    }
);

stockDetailsSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("StockDetails", stockDetailsSchema);
