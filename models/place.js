const mongoose = require("mongoose");
const Review = require("./review");

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
});
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const placeSchema = new mongoose.Schema({
    title: String,
    category: String,
    ages: [String],
    price: String,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
    images: [imageSchema],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref:"Review" 
        }
    ]
});


placeSchema.post("findOneAndDelete", async function(doc){ 
    if(doc){
        await Review.deleteMany({_id: {$in : doc.reviews}})
    }
})

module.exports = mongoose.model("Place", placeSchema);