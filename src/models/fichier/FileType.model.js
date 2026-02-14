const mongoose = require("mongoose");

const fileTypeSchema = new mongoose.Schema(
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
        collection: "file_type",
        timestamps: false
    }
);

module.exports = mongoose.model("FileType", fileTypeSchema);
