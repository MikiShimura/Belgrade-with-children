const mongoose = require("mongoose");
const Review = require("./review");

const placeSchema = new mongoose.Schema({
    title: String,
    category: String,
    ages: [String],
    price: String,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref:"Review" 
        }
    ]
})

module.exports = mongoose.model("Place", placeSchema);