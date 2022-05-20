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

    if (!materialId || !amount){
        console.error("The materialId and amount are required");
        res.status(400).send("The materialId and amount are required");
        return;
    }

    let material = await Material.findById(materialId);
    if (!material){
        console.error("The material you are trying to use doesn't exists");
        res.status(404).send("The material you are trying to use doesn't exists");
        return;
    }

    // impact calculation
    let impact = material.unitImpact * amount;

    var newActivity = new GarbageActivity({
        userId: userId,
        date: Date.now(),
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

router.delete('/:id', async (req, res) => {
    let id = req.params["id"];

    let result = await GarbageActivity.deleteOne({_id: id});
    if (result.deletedCount == 1){
        console.log(`Documento con id ${id} eliminato con successo`);
        res.status(200).send("Succesfully deleted");
    }else{
        console.error(`ERRORE: eliminazione documento con attivita'(garbage) con id ${id}`);
        res.status(404).send("Activity removal error");
    }
    
});

module.exports = router;

