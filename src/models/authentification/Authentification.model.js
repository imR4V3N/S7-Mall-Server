const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const authentificationSchema = new mongoose.Schema(
    {
        idUser: {
            type: String,
            required: true
        },

        idRole: {
            type: Number,
            required: true
        },

        identifiant: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        mdp: {
            type: String,
            required: true
        }
    },
    {
        collection: "authentification",
        timestamps: false
    }
);

module.exports = mongoose.model("Authentification", authentificationSchema);

authentificationSchema.pre("save", async function(next) {
    if (this.isModified("mdp")) {
        const salt = await bcrypt.genSalt(10);
        this.mdp = await bcrypt.hash(this.mdp, salt);
    }
    next();
});
