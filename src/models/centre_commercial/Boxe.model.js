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
            unique: true,
            required: true,
            trim: true
        },
        description: {
            type: String
        },
        status: {
            type: Number,
            default: 1
        },
        longueur:{
            type: Number,
            default:0
        },
        largeur:{
            type: Number,
            default:0
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
