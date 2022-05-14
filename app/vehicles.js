/**
 * Gestione listaggio veicoli presenti nel db 
 */

const express = require('express');
const router = express.Router();
const Vehicle = require('./models/vehicle.js').Vehicle;

router.get('', async (req, res) => {

    let vehicles = await Vehicle.find({});
    vehicles = vehicles.map( (vehicle) => {
        return {
            self: '/api/v1/vehicles/' + vehicle["_id"],
            name: vehicle["name"]
        };
    });
    res.status(200).json(vehicles);
});

router.get('/:id', async (req, res) => {

    let vehicle = await Vehicle.findById(req.params.id);
    vehicle = {
        self: '/api/v1/vehicles/' + vehicle.id,
        name: vehicle["name"],
        unitImpact: vehicle["unitImpact"]
    }

    res.status(200).json(vehicle);
});

module.exports = router;
