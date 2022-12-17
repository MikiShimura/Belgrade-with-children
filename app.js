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
const placeRoutes = require("./routes/places");
const reviewRoutes = require("./routes/reviews")
app.use("/places", placeRoutes);
app.use("/places/:id/reviews", reviewRoutes)


//Home
app.get("/", (req, res) => {
    res.send("home");
    // res.render("home")
});

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
