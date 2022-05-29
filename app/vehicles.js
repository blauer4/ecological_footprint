/**
 * @swagger
 * paths: 
 *      /api/v1/vehicles:
 *          get:
 *              summary: Get the vehicles
 *              description: Returns all the possible vehicles from the database in JSON format
 *              responses:
 *                  '200':
 *                      description: A list of vehicles
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          self: 
 *                                              type: string
 *                                              description: the link to the vehicle resource
 *                                          name:
 *                                              type: string
 *                                              description: the name of the vehicle 
 *                              example:
 *                                  - self: "/api/v1/vehicles/627d22980997269a08ba74b6"
 *                                    name: "macchina"
 *      /api/v1/vehicles/{id}:
 *          get:
 *              summary: Get the vehicle specified by id
 *              description: Returns the specified vehicle from the id in the parameters
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    required: true
 *                    description: The id of the correspondent vehicle you would like to search for
 *                    schema: 
 *                      type: string
 *              responses:
 *                  '200':
 *                      description: The specified vehicle in json format
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      self: 
 *                                          type: string
 *                                          description: The link to the vehicle resource
 *                                      name:
 *                                          type: string
 *                                          description: The name of the vehicle 
 *                                      unitImpact:
 *                                          type: integer
 *                                          description: The impact of the vehicle 
 *                              example:
 *                                    self: "/api/v1/vehicles/627d22980997269a08ba74b6"
 *                                    name: "macchina"
 *                                    unitImpact: 15
 *                  '404':
 *                      description: The specified vehicle doesn't exist
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

    if (!vehicle){
        res.status(404).send("Vehicle not found");
        return;
    }

    vehicle = {
        self: '/api/v1/vehicles/' + vehicle.id,
        name: vehicle["name"],
        unitImpact: vehicle["unitImpact"]
    }

    res.status(200).json(vehicle);
});

module.exports = router;
