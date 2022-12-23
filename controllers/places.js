const Place = require("../models/place");
const {cloudinary} = require("../cloudinary")

module.exports.index = async(req, res) => {
    const places = await Place.find({});
    res.render("places/index.ejs", { places });
};

module.exports.renderNewForm = (req, res) => {
    res.render("places/new.ejs");
};

module.exports.createPlace = async(req, res) => {
    const place = new Place(req.body.place);
    place.author = req.user._id;
    place.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await place.save();
    req.flash("success", "New place is registered!");
    res.redirect("/places");
};

module.exports.showPlace = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id)
        .populate({
            path:"reviews",
            populate: {
                path: "author"
            } 
        })
        .populate("author");
    if (!place) {
        req.flash("error", "We can't find the place");
        return res.redirect("/places");
    };
    res.render("places/show.ejs", { place });
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
        req.flash("error", "We can't find the place");
        return res.redirect("/places");
    };
    res.render("places/edit.ejs", { place });
};

module.exports.updatePlace = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, {...req.body.place})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    place.images.push(...imgs);
    await place.save();
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename) 
        }
        await place.updateOne({ $pull: {images: {filename: { $in: req.body.deleteImages}}}}) 
    };
    req.flash("success", "The place is edited!");
    res.redirect(`/places/${place._id}`);
};

module.exports.deletePlace = async(req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash("success", "The place is deleted!");
    res.redirect("/places");
};
