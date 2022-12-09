const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/", (req, res) => {
    res.render("home")
});

app.listen(port, () => {
    console.log("Waiting request at port 3000...")
});
