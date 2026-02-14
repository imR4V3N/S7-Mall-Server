const mongoose = require("mongoose");

const prefixeId = "pk_";

const parkingSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idCentreCommercial: {
            type: String,
            required: true
        },

        placeDisponible: {
            type: Number,
            required: true,
            min: 0
        },

        placeTotal: {
            type: Number,
            required: true,
            min: 0
        },

        tarifParHeure: {
            type: Number,
            required: true,
            min: 0
        },

        dureeMax: {
            type: String, // format "HH:mm"
            required: true
        }
    },
    {
        timestamps: true
    }
);

parkingSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Parking", parkingSchema);
