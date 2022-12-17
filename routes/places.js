const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validatePlace } = require("../middleware");

const Place = require("../models/place");

//Index Place
router.get("/", catchAsync(async(req, res) => {
    const places = await Place.find({});
    res.render("places/index.ejs", { places });
}));

//New Place
router.get("/new", (req, res) => {
    res.render("places/new.ejs");
});
// Create Place
router.post("/", validatePlace, catchAsync(async(req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect("/places");
}));

//Show a certain Place
router.get("/:id", catchAsync(async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id)
    .populate("reviews");
    res.render("places/show.ejs", { place });
}));


//Edit a certain Place
router.get("/:id/edit", catchAsync(async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/edit.ejs", { place });
}));
//Update a certain Place
router.put("/:id", validatePlace, catchAsync(async(req, res) => {
    const { id } = req.params;
    const editedPlace = await Place.findByIdAndUpdate(id, {...req.body.place})
    await editedPlace.save();
    res.redirect(`/places/${editedPlace._id}`);
}));

//Delete a certain Place
router.delete("/:id", catchAsync(async(req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect("/places");
}));


module.exports = router;