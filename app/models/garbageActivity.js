/**
 * @swagger
 * components:
 *      schemas:
 *          GarbageActivity:
 *              type: object
 *              required:
 *                  - userId
 *                  - date
 *                  - impact
 *                  - material
 *                  - amount
 *              properties:
 *                  userId:
 *                      type: string
 *                      description: id of this single garbage Activity.
 *                  date: 
 *                      type: string
 *                      format: date
 *                      description: date of insertion of the activity.
 *                  impact: 
 *                      type: integer
 *                      description: total impact of the activity, This value is calculated as the amount of the garbage disposed multiplied for the impact of the material disposed
 *                  material:
 *                      $ref: "#/components/schemas/Material"
 *                  amount:
 *                      type: integer
 *                      description: number of bags disposed
 *              example:
 *                  userId: 628367e9078d0308f8dd76ba
 *                  date: 2022-05-18T16:34:25.847Z
 *                  impact: 200
 *                  material: {name: Umido, unitImpact: 100}
 *                  amount: 2
 *                  
 */


var mongoose = require('mongoose');
const materialSchema = require('./material.js').materialSchema;
var Schema = mongoose.Schema;

module.exports = mongoose.model('GarbageActivity', new Schema({ 
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    impact: {type: Number, required: true},
	material: materialSchema,
	amount: { type: Number, required: true }
}));
