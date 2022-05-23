/**
 * @swagger
 * components:
 *      schemas:
 *          TransportActivity:
 *              type: object
 *              required:
 *                  - userId
 *                  - date
 *                  - impact
 *                  - vehicle
 *                  - amount
 *              properties:
 *                  userId:
 *                      type: string
 *                      description: Id of this single transport activity.
 *                  date: 
 *                      type: string
 *                      format: date
 *                      description: Date of insertion of the activity.
 *                  impact: 
 *                      type: integer
 *                      description: Total impact of the activity. This value is calculated as the amount of the kilometers multiplied for the impact of the vehicle used
 *                  vehicle:
 *                      $ref: "#/components/schemas/Vehicle"
 *                  amount:
 *                      type: integer
 *                      description: Number of kilometers
 *              example:
 *                  userId: 628367e9078d0308f8dd76ba
 *                  date: 2022-05-18T16:34:25.847Z
 *                  impact: 200
 *                  vehicle: {name: Macchina, unitImpact: 100}
 *                  amount: 2
 *                  
 */

var mongoose = require('mongoose');
const vehicleSchema = require('./vehicle.js').vehicleSchema;
var Schema = mongoose.Schema;

module.exports = mongoose.model('TransportActivity', new Schema({ 
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    impact: {type: Number, required: true},
	distance: { type: Number, required: true },
    vehicle: vehicleSchema
}));