const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    title: String,
    categories: [String],
    ages: [String],
    price: Number,
    description: String,
    location: String,
})

module.exports = mongoose.model("Place", placeSchema);