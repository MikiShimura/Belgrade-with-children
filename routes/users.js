const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const User = require("../models/user");


//New user
router.get("/register", (req, res) => {
    res.render("users/register.ejs");
});
//Create user
router.post("/register", async(req, res, next) => {
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
});

//login render
router.get("/login", (req, res) => {
    res.render("users/login")
})
//login
router.post("/login", passport.authenticate("local", {failureFlash:true, failureRedirect:"/login"}), (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/places")
})

module.exports = router;