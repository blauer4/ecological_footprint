/**
 * @swagger
 * paths: 
 *      /api/v2/tips:
 *          get:
 *              summary: Get the tips
 *              description: Returns all the possible tips from the database in JSON format
 *              responses:
 *                  '200':
 *                      description: A list of tips
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          self: 
 *                                              type: string
 *                                              description: the link to the tip resource
 *                              example:
 *                                  - self: "/api/v2/tips/629128f4ea8ec30051e944f7"
 *      /api/v2/tips/{id}:
 *          get:
 *              summary: Get the tip specified by id
 *              description: Returns the specified tip from the id in the parameters
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    required: true
 *                    description: The id of the correspondent tip you would like to search for
 *                    schema: 
 *                      type: string
 *              responses:
 *                  '200':
 *                      description: The specified tip in json format
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      self: 
 *                                          type: string
 *                                          description: The link to the tip resource
 *                                      text:
 *                                          type: string
 *                                          description: The text description of the tip
 *                              example:
 *                                    self: "/api/v2/tips/629128b2d6ddfc3796a4d6d7"
 *                                    text: "Use the bike instead of the car"
 */

const express = require('express');
const router = express.Router();
const Tip = require('./models/tip.js').Tip;

router.get('', async (req, res) => {

    let tips = await Tip.find({});
    tips = tips.map( (tip) => {
        return {
            self: '/api/v2/tips/' + tip["_id"]
        };
    });
    res.status(200).json(tips);
});

router.get('/:id', async (req, res) => {

    let tip = await Tip.findById(req.params.id);
    tip = {
        self: '/api/v2/tips/' + tip.id,
        text: tip["text"]
    }

    res.status(200).json(tip);
});


module.exports = router;
