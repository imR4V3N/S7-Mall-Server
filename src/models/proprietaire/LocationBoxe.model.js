const mongoose = require('mongoose');

const prefixeId = "lbox_";


const locationBoxeSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idBoxe: {
            type: String,
            required: true
        },
        idProprietaire: {
            type: String,
            required: true
        },
        idBoutique: {
            type: String
        },
        status: {
            type: Number,
            default: 1
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "location_boxe",
        timestamps: false
    }
);

locationBoxeSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36);
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("LocationBoxe", locationBoxeSchema);
