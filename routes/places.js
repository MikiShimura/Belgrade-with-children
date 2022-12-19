const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validatePlace, isLoggedIn, isAuthor } = require("../middleware");

const Place = require("../models/place");

//Index Place
router.get("/", catchAsync(async(req, res) => {
    const places = await Place.find({});
    res.render("places/index.ejs", { places });
}));

//New Place
router.get("/new", isLoggedIn, (req, res) => {
    res.render("places/new.ejs");
});
// Create Place
router.post("/", isLoggedIn, validatePlace, catchAsync(async(req, res) => {
    const place = new Place(req.body.place);
    place.author = req.user._id;
    await place.save();
    req.flash("success", "New place is registered!");
    res.redirect("/places");
}));

//Show a certain Place
router.get("/:id", catchAsync(async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id).populate('reviews').populate('author');
    if (!place) {
        req.flash("error", "We can't find the place");
        return res.redirect("/places");
    };
    res.render("places/show.ejs", { place });
}));


//Edit a certain Place
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
        req.flash("error", "We can't find the place");
        return res.redirect("/places");
    };
    res.render("places/edit.ejs", { place });
}));
//Update a certain Place
router.put("/:id", isLoggedIn, validatePlace, catchAsync(async(req, res) => {
    const { id } = req.params;
    const editedPlace = await Place.findByIdAndUpdate(id, {...req.body.place})
    await editedPlace.save();
    req.flash("success", "The place is edited!");
    res.redirect(`/places/${editedPlace._id}`);
}));

//Delete a certain Place
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash("success", "The place is deleted!");
    res.redirect("/places");
}));


module.exports = router;