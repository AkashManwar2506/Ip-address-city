const mongoose = require("mongoose")

const searchSchema = mongoose.Schema({
    userId: {type:String, required: true},
    searchedCity: {type: String, required: true}
})

const Search = mongoose.model("search", searchSchema)

module.exports = Search