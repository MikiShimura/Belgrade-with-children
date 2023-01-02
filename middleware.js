const ExpressError = require("./utils/ExpressError");
const {placeSchema} = require("./schemas");
const Place = require("./models/place");
const Review = require("./models/review");

module.exports.validatePlace = (req, res, next) =>{
    const {error} = placeSchema.validate(req.body);
    if (error){
        const msg = error.details.map(detail => detail.message).join(",")
        throw new ExpressError(msg, 404)
    }else{
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => { 
    if(!req.isAuthenticated()){ 
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Please Log in"); 
        res.redirect("/") 
    } 
    next(); 
};

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params; 
    const place = await Place.findById(id); 
    if(!req.user){
        return next();
    }else if(!place.author.equals(req.user._id)) { 
        req.flash("error", "You don't have right for the action")
        return res.redirect(`/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params; 
    const review = await Review.findById(reviewId); 
    if(!req.user){
        return next();
    }else if(!review.author._id.equals(req.user._id)) { 
        req.flash("error", "You don't have right for the action")
        return res.redirect(`/${id}`);
    }
    next();
}
