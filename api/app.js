const {getTopics} = require(`${__dirname}/controllers/topics.controller`)
const {getAnArticle, getAllArticles} = require(`${__dirname}/controllers/articles.controller`)
const {handlePsqlErrors, handleCustomErrors, handleServerErrors} = require(`${__dirname}/errors`)
const express = require("express");
const data = require(`${__dirname}/../endpoints.json`)

const app = express();
app.use(express.json());

app.get("/api",(req, res) => {
    res.status(200).send(data)
})

app.get("/api/topics",getTopics)

app.get("/api/articles/", getAllArticles)

app.get("/api/articles/:article_id", getAnArticle);

app.all("*", (_,res) => {
    res.status(404).send({ msg: "Not found" });
});

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app;

