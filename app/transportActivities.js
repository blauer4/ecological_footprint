const express = require('express');
const TransportActivity = require('./models/transportActivity.js');
const Vehicle = require('./models/vehicle.js').Vehicle;
const router = express.Router();


router.get('', async (req, res) => {

    let activities = await TransportActivity.find({});

    res.status(200).json(activities);
});

router.get('/:id', async (req, res) => {

    let activity = await TransportActivity.findById(req.params.id);

    res.status(200).json(activity);
});


router.post('', async (req, res) => {

    let userId = req.body["userId"];
    let vehicleId = req.body["vehicleId"];
    let distance = req.body["distance"];


    //TODO get the impact from the DB
    let unitImpact = 5;
    let impact = unitImpact * parseInt(distance);

    let vehicle = await Vehicle.findById(vehicleId);

    var newActivity = new TransportActivity({
        userId: userId,
        distance: distance,
        impact: impact,
        vehicle: vehicle
    });

    activity = await newActivity.save();

    /**
     * Return the link to the newly created resource 
     */
    res.location("/api/v1/activities/transports/" + activity.id).status(201).send();
});


module.exports = router;