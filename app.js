const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Belgrade-with-children", 
{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch(err => {
        console.log("MongoDB connection error:");
        console.log(err);
    })

const path = require("path");
app.set("views", path.join(__dirname, "views"));

const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate); 

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));


//[Routings]
//Home
app.get("/", (req, res) => {
    res.send("home");
    // res.render("home")
});

//Index Place
app.get("/places", (req, res) => {
    res.render("places/index.ejs");
});

// //Show a certain Place
// app.get("/places/:id", (req, res) => {
//     const { id } = req.params;　//クエリストリング部(req.params)に変数を与える
//     const comment = comments.find(c => c.id === id); //idが一致するコメントを探す
//     res.render("show.ejs") //show.ejsをレンダーするけど、実際のURLはcomments/:idになるのに注意
// });

// //New Place
// app.get("/comments/new", (req, res) => {
//     res.render("comments/new.ejs"); //コメント入力フォームを作成
// });

// //Edit a certain Place
// app.get("/comments/:id/edit", (req, res) => {
//     const { id } = req.params;
//     const comment = comments.find(c => c.id === id);
//     res.render("comments/edit.ejs",{comment});
// });

// //Update a certain Place
// app.patch("/comments/:id", (req, res) => { //patchはデータを一部変更するときに使う、更新する内容しかreq.bodyに送らない
//     const { id } = req.params; 
//     const newCommentText = req.body.comment; //入力されたデータ(req.body)のコメント部を変数に入れる
//     const foundComment = comments.find(c => c.id === id); //idが一致するコメントを探す
//     foundComment.comment = newCommentText; //idが一致したコメントのコメント部を、入力されたデータで置き換える
//     res.redirect("/comments");
// });

// //Delete a certain Place
// app.delete("/comments/:id", (req, res) => {
//     const { id } = req.params;
//     comments = comments.filter(c => c.id !== id); //commentsの配列からidの一致しないものを取り除いて、それをcommentsに再代入
//     res.redirect("/comments");
// });


// //Post(review)
// router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// //Delete(review)
// router.delete("/:reviewId", isLoggedIn, isReviewAuther, catchAsync(reviews.deleteReview));



app.listen(3000, () => {
    console.log("Waiting request at port 3000...")
});
