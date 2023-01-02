const express = require("express");
const router = express.Router();
const users = require("../controllers/users")
const passport = require('passport');

router.route("/register")
    .get(users.renderRegisterForm)
    .post(users.register);

router.route("/login")
    .get(users.renderLoginrForm)
    .post(passport.authenticate("local", {failureFlash:true, failureRedirect:"/user/login"}), users.login)

router.get("/logout", users.logout)

module.exports = router;