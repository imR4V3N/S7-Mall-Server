const mongoose = require("mongoose");

const prefixeId = "file_";

const fileSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        nom: {
            type: String
        },
        url:{
            type: String
        },
        idType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FileType",
            required: true
        },
        idProprietaire: {
            type: String,
            required: true
        },
        date:{
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "file",
        timestamps: true
    }
);

fileSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36);
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("File", fileSchema);
