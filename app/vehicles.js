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

router.get('/:id', async (req, res) => {

    let vehicle = await Vehicle.findById(req.params.id);

    res.status(200).json(vehicle);
});

module.exports = router;
