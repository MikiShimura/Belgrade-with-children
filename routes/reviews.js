const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");

const Place = require("../models/place");
const Review = require("../models/review");

//Post review
router.post("/", catchAsync(async(req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    place.reviews.push(review);
    await review.save();
    await place.save();
    res.redirect(`/places/${place._id}`)
}));

//Delete review
router.delete("/:reviewId", catchAsync(async(req, res) => {
    const { id, reviewId } = req.params
    await Place.findByIdAndUpdate(id, { $pull:{ reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/places/${id}`);
}));

module.exports = router;