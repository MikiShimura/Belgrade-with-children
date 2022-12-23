if(process.env.NODE_ENV !== "production") { 
    require("dotenv").config();
};

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
const User = require("./models/user");

//Errors
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { validatePlace } = require("./middleware");

//
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));

//session
const session = require("express-session");
const sessionConfig = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

//flash
const flash = require("connect-flash");
app.use(flash());


//passport 
const passport = require("passport");
const localStrategy = require("passport-local");

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));  
passport.serializeUser(User.serializeUser());  
passport.deserializeUser(User.deserializeUser()); 

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//[Routings]
const placeRoutes = require("./routes/places");
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users")
app.use("/places", placeRoutes);
app.use("/", userRoutes)
app.use("/places/:id/reviews", reviewRoutes);

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
