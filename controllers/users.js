const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register.ejs");
};

module.exports.register = async(req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err); 
            req.flash("success", "Welcome!");
            res.redirect("/places");
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/login");
    }
};

module.exports.renderLoginrForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || '/places';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "You logged out");
        res.redirect('/places');
    });
}