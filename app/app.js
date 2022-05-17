const express = require("express");
const productActivities = require("./productActivities.js");
const garbageActivities = require("./garbageActivities.js");
const transportActivities = require("./transportActivities.js");
const listActivities = require("./listActivities.js");
const products = require("./products.js");
const materials = require("./materials.js");
const vehicles = require("./vehicles.js");
const register = require("./registration.js")

const app = express();

/**
 * Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Serve static files
 */
app.use('/', express.static('static'));

/**
 * V1 Api endopoints routes
 */
app.use('/api/v1/products', products);
app.use('/api/v1/activities/products', productActivities);
app.use('/api/v1/activities/garbage', garbageActivities);
app.use('/api/v1/activities/transport', transportActivities);
app.use('/api/v1/activities', listActivities);

app.use('/api/v1/materials', materials);
app.use('/api/v1/vehicles', vehicles); 
app.use('/api/v1/register', register);

module.exports = app;