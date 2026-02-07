const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
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
        collection: "role",
        timestamps: false
    }
);

module.exports = mongoose.model("Role", roleSchema);
