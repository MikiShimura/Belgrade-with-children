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
    await Place.deleteMany({});
        const place = new Place({
            title: 'Pozorište lutaka "Pinokio"',
            categories: ["Culture"],
            ages: ["0~2", "3~6"],
            price: 500,
            description: "Fun puppet theater for small children",
            location: "Bulevar maršala Tolbuhina 1",
            image: "https://images.unsplash.com/photo-1606733894347-7cb201dc810b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80"
        });
        await place.save();
    }

seedDB().then(() => {
    mongoose.connection.close();
});