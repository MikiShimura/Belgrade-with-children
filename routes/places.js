const express = require("express");
const router = express.Router({ mergeParams: true });
const places = require("../controllers/places")
const catchAsync = require("../utils/catchAsync");
const { validatePlace, isLoggedIn, isAuthor } = require("../middleware");

const Place = require("../models/place");

router.route("/")
    .get(catchAsync(places.index))
    .post(isLoggedIn, validatePlace, catchAsync(places.createPlace))

router.get("/new", isLoggedIn, places.renderNewForm);

router.route("/:id")
    .get(catchAsync(places.showPlace))
    .put(isLoggedIn, validatePlace, catchAsync(places.updatePlace))
    .delete(isLoggedIn, isAuthor, catchAsync(places.deletePlace))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(places.renderEditForm))

module.exports = router;