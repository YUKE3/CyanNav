const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tagSchema = new Schema({
    name: {
        type: String,
        required: [true, "no name given"],
        maxLength: 50,
    },
})

const tagModel = mongoose.model("tag", tagSchema)
module.exports = tagModel
