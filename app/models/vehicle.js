/**
 * @swagger
 *  components:
 *      schemas:
 *          Vehicle:
 *              type: object
 *              required:
 *                  - name
 *                  - unitImpact
 *              properties:
 *                  name:
 *                      type: string
 *                      description: name of the vehicle
 *                  unitImpact:
 *                      type: integer
 *                      description: value of the impact per single unit
 *              example:
 *                  name: pedibus
 *                  unitImpact: 1000
 */       

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vehicleSchema = new Schema({ 
    name: { type: String, required: true },
    unitImpact: { type: String, required: true }
});

var Vehicle = mongoose.model('Vehicle', vehicleSchema);

// set up a mongoose model
module.exports = {
    Vehicle,
    vehicleSchema
};