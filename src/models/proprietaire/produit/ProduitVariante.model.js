const mongoose = require("mongoose");

// CREATE TABLE variante_produit (
//     id serial primary key,
//     idProduit int,
//     val varchar(255),
//     desce text
// );

const prefixeId = "vp_";

const produitVarianteSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idProduit: {
            type: String,
            required: true
        },
        val: {
            type: String,
            required: true,
            trim: true
        },
        desce: {
            type: String,
            trim: true
        }
    },
    {
        collection:"produit_variante",
        timestamps:true
    }
);

produitVarianteSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("ProduitVariante", produitVarianteSchema);
