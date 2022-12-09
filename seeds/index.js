const Place = require("../models/place");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Belgrade-with-children", 
{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch(err => {
        console.log("MongoDB connection error:");
        console.log(err);
    })

const seedDB = async () => { 
    // await Campground.deleteMany({});
        const place = new Place({
            title: 'Pozorište lutaka "Pinokio"',
            categories: ["Culture"],
            ages: ["0~2", "3~6"],
            price: 500,
            description: "Fun puppet theater for small children",
            location: "Bulevar maršala Tolbuhina 1",
        });
        await place.save();
    }

seedDB().then(() => {
    mongoose.connection.close();
});