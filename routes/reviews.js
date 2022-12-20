const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");

const Place = require("../models/place");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

//Post review
router.post("/", isLoggedIn, catchAsync(async(req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash("success", "The review is posted!");
    res.redirect(`/places/${place._id}`)
}));

//Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params
    await Place.findByIdAndUpdate(id, { $pull:{ reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "The review is deleted!");
    res.redirect(`/places/${id}`);
}));

module.exports = router;