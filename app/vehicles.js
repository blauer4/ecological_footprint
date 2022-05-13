/**
 * Gestione listaggio veicoli presenti nel db 
 */

const express = require('express');
const router = express.Router();
const Vehicle = require('./models/vehicle.js').Vehicle;

router.get('', async (req, res) => {

    let vehicles = await Vehicle.find({});

    res.status(200).json(vehicles);
});