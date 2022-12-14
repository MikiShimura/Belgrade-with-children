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
app.set("view engine", "ejs");

//Models
const Place = require("./models/place");
const Review = require("./models/review");

//Errors
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { validatePlace } = require("./middleware");

//
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
app.get("/places", catchAsync(async(req, res) => {
    const places = await Place.find({});
    res.render("places/index.ejs", { places });
}));

//New Place
app.get("/places/new", (req, res) => {
    res.render("places/new.ejs");
});
// Create Place
app.post("/places", validatePlace, catchAsync(async(req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    console.log(req.body)
    res.redirect("/places");
}));

//Show a certain Place
app.get("/places/:id", catchAsync(async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id)
    .populate("reviews");
    res.render("places/show.ejs", { place });
}));


//Edit a certain Place
app.get("/places/:id/edit", catchAsync(async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/edit.ejs", { place });
}));
//Update a certain Place
app.put("/places/:id", validatePlace, catchAsync(async(req, res) => {
    const { id } = req.params;
    const editedPlace = await Place.findByIdAndUpdate(id, {...req.body.place})
    await editedPlace.save();
    res.redirect(`/places/${editedPlace._id}`);
}));

//Delete a certain Place
app.delete("/places/:id", catchAsync(async(req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect("/places");
}));

//Post review
app.post("/places/:id/reviews", catchAsync(async(req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndDelete(id);
    const review = new Review(req.body.reviews);
    place.reviews.push(review);
    await review.save();
    await place.save();
    console.log(place)
    res.redirect(`/places/${place._id}`)
}));

// //Delete(review)
// router.delete("/:reviewId", isLoggedIn, isReviewAuther, catchAsync(reviews.deleteReview));

app.all("*", (req, res, next) =>{
    next(new ExpressError("We can't find the page", 404));
})

app.use((err, req, res, next) => { 
    const {statusCode = 500} = err;
    if (!err.message){
        err.message = "We got error";
    }
    res.status(statusCode).render("error", { err });
})

app.listen(3000, () => {
    console.log("Waiting request at port 3000...")
});
