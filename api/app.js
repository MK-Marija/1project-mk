const{getTopics} = require(`${__dirname}/controllers/topics.controller`)
const express = require("express");
const data = require(`${__dirname}/../endpoints.json`)

const app = express();
app.get("/api/topics",getTopics)

app.get("/api",(req, res) => {
    res.status(200).send(data)
})

module.exports = app;

