/**
 * @swagger
 * paths:
 *  /api/v1/activities/transport:
 *      get:
 *          summary: Returns all the transport activities
 *          description: Returns all the transport activities 
 *          responses:
 *              '200':
 *                  description: Returns the transport activities in JSON format described as in the model
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: "#/components/schemas/TransportActivity"
 *      post:
 *          summary: Insert a new transport activity
 *          description: Returns the link to the resource created. Requires authentication
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              vehiclelId:
 *                                  type: string
 *                                  description: The id of the vehicle that you want to insert into the activity
 *                              amount:
 *                                  type: integer
 *                                  description: The amount of the kilometers you want to insert into the activity
 *                              userId:
 *                                  type: string
 *                                  description: The userId of the user
 *          responses:
 *              '201': 
 *                  description: Return the link to the resource that i created
 *              '400': 
 *                  description: A required parameter is missing
 *              '404':
 *                  description: The vehicle that is inserted in the activity is not present in the database
 *  /api/v1/activities/transport/{id}:
 *      get:
 *          summary: Returns one transport activity
 *          description: Returns one transport activity associated with the given ID
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: The id of the transport activity to be found.
 *              schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: Returns one transport activity in JSON format described as in the model
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: "#/components/schemas/TransportActivity"
 *      delete:
 *          summary: Deletes one transport activity
 *          description: Deletes one transport activity associated with the given ID
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: The id of the transport activity to be deleted.
 *              schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: Deletes the given transport activity
 *                  content: 
 *                      text/html:
 *                          schema:
 *                              type: string
 *                              example: "OK"
 *              '404':
 *                  description: The given transport activity doesn't exists
 *                  content: 
 *                      text/html:
 *                          schema:
 *                              type: string
 *                              example: "Fail"
 */

const express = require('express');
const TransportActivity = require('./models/transportActivity.js');
const Vehicle = require('./models/vehicle.js').Vehicle;
const User = require('./models/user.js').User;
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

    let userId = req.loggedUser.id;
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

    await User.findByIdAndUpdate(userId,{$inc: {totalImpact: impact}});

    /**
     * Return the link to the newly created resource 
     */
    res.location("/api/v1/activities/transports/" + activity.id).status(201).send();
});

router.delete('/:id', async (req, res) => {
    let id = req.params["id"];
    let userId = req.loggedUser.id;
    let transport = await TransportActivity.findById(id);

    if(transport){
        let user = await User.findById(userId);
        await User.findByIdAndUpdate(userId,{totalImpact: user.totalImpact-transport.impact});

        let result = await TransportActivity.deleteOne({_id: id});
        if (result.deletedCount == 1){
            console.log(`Documento con id ${id} eliminato con successo`);
            res.send("OK");
        }else{
            console.error(`ERRORE: eliminazione documento con attivita'(transport) con id ${id}`);
            res.status(404).send("Fail");
        }

        return;
    }

    res.status(404).send("Activity not found");    
    
});

module.exports = router;