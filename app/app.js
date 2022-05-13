const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const materials = require("./materials.js");
app.use('/api/v1/materials', materials);

module.exports = app;