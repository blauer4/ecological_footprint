const express = require("express");
const productActivities = require("./productActivities.js");
const materials = require("./materials.js");

const app = express();

/**
 * Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * V1 Api endopoints routes
 */
app.use('/api/v1/activities/products', productActivities);
app.use('/api/v1/materials', materials);

module.exports = app;