/**
 * @swagger
 * paths: 
 *      /api/v1/materials:
 *          get:
 *              summary: Get the materials
 *              description: Returns all the possible materials from the database in JSON format
 *              responses:
 *                  '200':
 *                      description: A list of materials in JSON format
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          self: 
 *                                              type: string
 *                                              description: The link to the material resource
 *                                          name:
 *                                              type: string
 *                                              description: the name of the material 
 *                              example:
 *                                  - self: "/api/v1/materials/627e62bbf1f1da75f033373f"
 *                                    name: "Umido"
 *      /api/v1/materials/{id}:
 *          get:
 *              summary: Get the material specified by id
 *              description: Returns the specified material from the id in the parameters
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    required: true
 *                    description: The id of the correspondent material you would like to search for
 *                    schema: 
 *                      type: string
 *              responses:
 *                  '200':
 *                      description: The specified material in JSON format
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      self: 
 *                                          type: string
 *                                          description: The link to the material resource
 *                                      name:
 *                                          type: string
 *                                          description: The name of the material 
 *                                      unitImpact:
 *                                          type: integer
 *                                          description: The impact of the material 
 *                              example:
 *                                    self: "/api/v1/materials/627e62bbf1f1da75f033373f"
 *                                    name: "Umido"
 *                                    unitImpact: 10
 */

 const express = require('express');
 const router = express.Router();
 const Material = require('./models/material.js').Material; 

 router.get('', async (req, res) => {
 
    let materials = await Material.find({});
    materials = materials.map( (material) => {
        return {
            self: '/api/v1/materials/' + material["_id"],
            name: material["name"]
        };
    });
    res.status(200).json(materials);
});

router.get('/:id', async (req, res) => {

    let material = await Material.findById(req.params.id);

    if (!material){
        res.status(404).send("Garbage not found");
        return;
    }

    material = {
        self: '/api/v1/materials/' + material.id,
        name: material["name"],
        unitImpact: material["unitImpact"]
    }

    res.status(200).json(material);
});

module.exports = router;
