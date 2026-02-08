const mongoose = require("mongoose");

const prefixeId = "bx_"
const boxeSchema = new mongoose.Schema(
    {
        _id:{
            type:String
        },
        idCentreCommercial: {
            type: String,
            required: true
        },
        nom: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
        },
        isDisponible: {
            type: Boolean,
            default: true
        }
    },
    {
        collection: "boxe",
        timestamps: true // pour createdAt / updatedAt
    }
);

boxeSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Boxe", boxeSchema);
