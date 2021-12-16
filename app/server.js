'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;
const HOST = "0.0.0.0";
const path = require('path'); 

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());

app.use(express.static(__dirname + "/css", {
  index: false,
  immutable: true,
  cacheControl: true,
  maxAge: "30d" 
}));

app.use(express.static(__dirname + "/img", {
  index: false,
  immutable: true,
  cacheControl: true,
  maxAge: "30d"
}));
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });
  app.listen(PORT,HOST);
  console.log("up and running");