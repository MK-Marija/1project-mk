const {getTopics} = require("./controllers/topics.controller")
const {getAnArticle, getAllArticles, updateArticleById} = require("./controllers/articles.controller")
const {getAllComments} = require("./controllers/comments.controller")
const{getUsers} = require("./controllers/users.controller")
const {postComment,deleteComment} = require("./controllers/comments.controller")
const {handlePsqlErrors, handleCustomErrors, handleServerErrors} = require("./errors")
const express = require("express");
const data = require("../endpoints.json")
const cors = require('cors');
app.use(cors());

const app = express();
app.use(express.json());

app.get("/api",(req, res) => {
    res.status(200).send(data)
})

app.get("/api/topics",getTopics)

app.get("/api/articles/", getAllArticles)

app.get("/api/articles/:article_id", getAnArticle);
app.get("/api/articles/:article_id/comments", getAllComments)
app.post("/api/articles/:article_id/comments", postComment)
app.patch("/api/articles/:article_id", updateArticleById)
app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)

app.all("*", (_,res) => {
    res.status(404).send({ msg: "Not found" });
});

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app;

