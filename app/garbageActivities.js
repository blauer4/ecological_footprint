/**
 * @swagger
 * paths:
 *  /api/v1/activities/garbage:
 *      get:
 *          summary: Returns all the garbage activities
 *          description: Returns all the garbage activities 
 *          responses:
 *              '200':
 *                  description: Returns the garbage activities in JSON format described as in the model
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: "#/components/schemas/GarbageActivity"
 *      post:
 *          summary: Insert a new garbage activity
 *          description: Returns the link to the resource created. Requires authentication
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              materialId:
 *                                  type: string
 *                                  description: The id of the garbage that you want to insert into the activity
 *                              amount:
 *                                  type: integer
 *                                  description: The amount of the garbage you want to insert into the activity
 *          responses:
 *              '201': 
 *                  description: Return the link to the resource that i created
 *              '400': 
 *                  description: A required parameter is missing
 *              '404':
 *                  description: The material that is inserted is not present in the database
 *  /api/v1/activities/garbage/{id}:
 *      get:
 *          summary: Returns one garbage activity
 *          description: Returns one garbage activity associated with the given ID
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: The id of the garbage activity to be found.
 *              schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: Returns one garbage activity in JSON format described as in the model
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: "#/components/schemas/GarbageActivity"
 *      delete:
 *          summary: Deletes one garbage activity
 *          description: Deletes one garbage activity associated with the given ID
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: The id of the garbage activity to be deleted.
 *              schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: Deletes the given garbage activity
 *                  content: 
 *                      text/html:
 *                          schema:
 *                              type: string
 *                              example: "Succesfully deleted"
 *              '404':
 *                  description: The given garbage activity doesn't exists
 *                  content: 
 *                      text/html:
 *                          schema:
 *                              type: string
 *                              example: "Activity removal error"
 */

const express = require('express');
const GarbageActivity = require('./models/garbageActivity.js');
const Material = require('./models/material.js').Material; 
const User = require('./models/user.js').User; 

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

    let userId = req.loggedUser.id;
    let materialId = req.body["materialId"];
    let amount = req.body["amount"];

    if (!materialId || !amount){
        console.error("The materialId and amount are required");
        res.status(400).send("The materialId and amount are required");
        return;
    }

    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0){
        console.error("The amount must be a positive number");
        res.status(400).send("The amount must be a positive number");
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

    await User.findByIdAndUpdate(userId,{$inc: {totalImpact: impact}});

    /**
     * Return the link to the newly created resource 
     */
    res.location("/api/v1/activities/garbage/" + activity.id).status(201).send();
});

router.delete('/:id', async (req, res) => {
    let id = req.params["id"];
    let userId = req.loggedUser.id;
    let garbage = await GarbageActivity.findById(id);

    if(garbage){
        await User.findByIdAndUpdate(userId,{$inc: {totalImpact: -garbage.impact}});
    }

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

