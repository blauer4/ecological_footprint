const express = require("express");
const productActivities = require("./productActivities.js");
const garbageActivities = require("./garbageActivities.js");
const listActivities = require("./listActivities.js");
const materials = require("./materials.js");
const vehicles = require("./vehicles.js");

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
app.use('/api/v1/activities/garbage', garbageActivities);
app.use('/api/v1/listactivities', listActivities);

app.use('/api/v1/materials', materials);
app.use('/api/v1/vehicles', vehicles); 

module.exports = app;