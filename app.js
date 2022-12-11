const express = require("express");
const app = express();

const methodOverride = require('method-override');

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

const path = require("path");
app.set("views", path.join(__dirname, "views"));

const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate); 

const Place = require("./models/place");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));



//[Routings]
//Home
app.get("/", (req, res) => {
    res.send("home");
    // res.render("home")
});

//Index Place
app.get("/places", async(req, res) => {
    const places = await Place.find({});
    res.render("places/index.ejs", { places });
});

//New Place
app.get("/places/new", (req, res) => {
    res.render("places/new.ejs");
});
// Create Place
app.post("/places", async(req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect("/places");
});

//Show a certain Place
app.get("/places/:id", async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/show.ejs", { place });
});


//Edit a certain Place
app.get("/places/:id/edit", async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/edit.ejs", { place });
});
//Update a certain Place
app.put("/places/:id", async(req, res) => {
    const { id } = req.params;
    const editedPlace = await Place.findByIdAndUpdate(id, {...req.body.place})
    await editedPlace.save();
    res.redirect(`/places/${editedPlace._id}`);
});

//Delete a certain Place
app.delete("/places/:id", async(req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect("/places");
});


// //Post(review)
// router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// //Delete(review)
// router.delete("/:reviewId", isLoggedIn, isReviewAuther, catchAsync(reviews.deleteReview));

app.listen(3000, () => {
    console.log("Waiting request at port 3000...")
});
