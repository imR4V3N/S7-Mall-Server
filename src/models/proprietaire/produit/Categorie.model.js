const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
    {
        val: {
            type: String,
            required: true,
        },
        desce: {
            type: String,
        }
    },
    {
        collection: "categorie",
        timestamps: false
    }
);

module.exports = mongoose.model("Categorie", categorieSchema);
