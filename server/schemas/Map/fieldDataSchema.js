const mongoose = require("mongoose")
const Schema = mongoose.Schema

const fieldDataSchema = new Schema({
    // TODO: (build4) TO BE IMPLEMENTED
    geoBuf: {
        type: Buffer,
        required: true,
    },
})

const fieldDataModel = mongoose.model("fieldData", fieldDataSchema)
module.exports = fieldDataModel
