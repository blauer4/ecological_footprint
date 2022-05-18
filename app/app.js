const express = require("express");
const cookieParser = require("cookie-parser");

const productActivities = require("./productActivities.js");
const garbageActivities = require("./garbageActivities.js");
const transportActivities = require("./transportActivities.js");
const listActivities = require("./listActivities.js");
const products = require("./products.js");
const materials = require("./materials.js");
const vehicles = require("./vehicles.js");
const register = require("./registration.js")
const login = require("./login.js")

const tokenChecker = require('./tokenChecker.js');

const app = express();

/**
 * Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Protect the UI private area
 */
app.use('/private_area', tokenChecker);

/**
 * Serve static files
 */
app.use('/', express.static('static/authentication'));
app.use('/img', express.static('static/img'));
app.use('/private_area', express.static('static/private_area'));

/**
 * protect some endpoints (also products to avoid product insertion from unauthorizes users)
 */
app.use('/api/v1/activities', tokenChecker);
app.use('/api/v1/activities/products', tokenChecker);
app.use('/api/v1/activities/garbage', tokenChecker);
app.use('/api/v1/activities/transport', tokenChecker);
app.use('/api/v1/products', tokenChecker);


/**
 * V1 Api endopoints routes
 */
app.use('/api/v1/activities/products', productActivities);
app.use('/api/v1/activities/garbage', garbageActivities);
app.use('/api/v1/activities/transport', transportActivities);
app.use('/api/v1/activities', listActivities);

app.use('/api/v1/products', products);
app.use('/api/v1/materials', materials);
app.use('/api/v1/vehicles', vehicles); 

app.use('/api/v1/register', register);
app.use('/api/v1/login', login);

module.exports = app;