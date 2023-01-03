if(process.env.NODE_ENV !== "production") { 
    require("dotenv").config();
};

const express = require("express");
const app = express();

const methodOverride = require('method-override');

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/Belgrade-with-children";
const secret = process.env.SECRET || 'mysecret';
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
mongoose.connect(dbUrl, 
{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch(err => {
        console.log("MongoDB connection error:");
        console.log(err);
    })
mongoose.set('strictQuery', false);

const path = require("path");
app.set("views", path.join(__dirname, "views"));

//Ejs
const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate); 
app.set("view engine", "ejs");

//Sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

//Models
const Place = require("./models/place");
const Review = require("./models/review");
const User = require("./models/user");

//Errors
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { validatePlace } = require("./middleware");

//Parse
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));

//ConnectMongo
const MongoStore = require('connect-mongo');
const store = MongoStore.create({ 
    mongoUrl: dbUrl, 
    crypto: { 
        secret: secret 
    }, 
    touchAfter: 24 * 3600 
}); 
store.on("error", e => { 
    console.log("session store error", e) 
});

//Session
const session = require("express-session");
const sessionConfig = {
    secret: secret,
    store: store, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: "session",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

//Flash
const flash = require("connect-flash");
app.use(flash());

//Passport 
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
});

//Helmet
// const helmet = require("helmet");
// app.use(helmet({
//     contentSecurityPolicy: false,
// }));

// const scriptSrcUrls = [
//     'https://api.mapbox.com',
//     'https://cdn.jsdelivr.net',
//     'https://ka-f.fontawesome.com',
//     "https://kit.fontawesome.com",
// ];
// const styleSrcUrls = [
//     'https://api.mapbox.com',
//     'https://cdn.jsdelivr.net',
//     'https://ka-f.fontawesome.com',
//     "https://kit.fontawesome.com",
// ];
// const connectSrcUrls = [
//     'https://api.mapbox.com',
//     'https://*.tiles.mapbox.com',
//     'https://events.mapbox.com',
//     'https://ka-f.fontawesome.com',
//     "https://kit.fontawesome.com",
// ];
// const fontSrcUrls = [];
// const imgSrcUrls = [
//     `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
//     'https://images.unsplash.com'
// ];

// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ['https://ka-f.fontawesome.com'],
//         connectSrc: ["'self'", ...connectSrcUrls],
//         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//         workerSrc: ["'self'", "blob:"],
//         childSrc: ["blob:"],
//         objectSrc: [],
//         imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
//         fontSrc: ["'self'", ...fontSrcUrls]
//     }
// }));

//[Routings]
const placeRoutes = require("./routes/places");
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users")
app.use("/", placeRoutes);
app.use("/user", userRoutes)
app.use("/:id/reviews", reviewRoutes);

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

app.listen(port, () => {
    console.log(`Waiting request at port ${port}..`)
});
