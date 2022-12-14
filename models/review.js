const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: Number,
    body: String,
    date: String
})

module.exports = mongoose.model("Review", reviewSchema);