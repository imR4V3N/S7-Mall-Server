const mongoose = require("mongoose");

const prefixeId = "dmdL_";
const demandeLocationSchema = new mongoose.Schema(
    {
        _id:{
            type: String
        },
        idOffreLocation: {
            type:String,
            required:true
        },
        idProprietaire:{
            type:String,
            required:true
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
            default: 2
        }
    },
    {
        collection:"demande_de_location",
        timestamps:true
    }
)

demandeLocationSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("DemandeLocation", demandeLocationSchema);
