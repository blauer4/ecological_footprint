/**
 * Ritorna un tipo di attività del tipo spazzatura(garbage)
 */

const express = require('express');
const GarbageActivity = require('./models/garbageActivity.js');
const Material = require('./models/material.js').Material; 

const router = express.Router();

router.get('', async (req, res) => {

    let activities = await GarbageActivity.find({});

    res.status(200).json(activities);
});

router.get('/:id', async (req, res) => {

    let activity = await GarbageActivity.findById(req.params.id);

    res.status(200).json(activity);
});

router.post('', async (req, res) => {

    let userId = req.body["userId"];
    let materialId = req.body["materialId"];
    let amount = req.body["amount"];

    //TODO calculation of the impact 
    // get the impact of the product from the DB
    let impact = 10 * amount;
    let material = await Material.findById(materialId);

    var newActivity = new GarbageActivity({
        userId: userId,
        material: material,
        amount: amount,
        impact: impact
    });
    
    activity = await newActivity.save();

    /**
     * Return the link to the newly created resource 
     */
    res.location("/api/v1/activities/garbage/" + activity.id).status(201).send();
});

module.exports = router;

