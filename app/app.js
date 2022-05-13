const express = require("express");
const productActivities = require("./productActivities.js");

const app = express();

/**
 * Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/activities/products', productActivities);

module.exports = app;