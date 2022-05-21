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

    if (!vehicleId || !distance){
        console.error("The vehicleId and distance are required");
        res.status(400).send("The vehicleId and distance are required");
        return;
    }

    distance = parseFloat(distance);
    if (isNaN(distance) || distance <= 0){
        console.error("The distance must be a positive number");
        res.status(400).send("The distance must be a positive number");
        return;
    }

    let vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle){
        console.error("The vehicle you are trying to use doesn't exists");
        res.status(404).send("The vehicle you are trying to use doesn't exists");
        return;
    }

    // calculate the impact
    let impact = vehicle.unitImpact * parseInt(distance);


    var newActivity = new TransportActivity({
        userId: userId,
        date: Date.now(),
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

router.delete('/:id', async (req, res) => {
    let id = req.params["id"];

    let result = await TransportActivity.deleteOne({_id: id});
    if (result.deletedCount == 1){
        console.log(`Documento con id ${id} eliminato con successo`);
        res.send("OK");
    }else{
        console.error(`ERRORE: eliminazione documento con attivita'(transport) con id ${id}`);
        res.send("Fail");
    }
    
});

module.exports = router;