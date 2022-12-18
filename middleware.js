const ExpressError = require("./utils/ExpressError");
const {placeSchema} = require("./schemas");

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
        res.redirect("/login") 
    } 
    next(); 
};

module.exports.isAdmin
