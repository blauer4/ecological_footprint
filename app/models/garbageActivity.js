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
 *                      type: object
 *                      properties:
 *                          name: 
 *                              type: string
 *                              description: the name of the material to dispose.
 *                          unitImpact: 
 *                              type: integer
 *                              description: The value of the impact of a single unit of that material. 
 *                  amount:
 *                      type: integer
 *                      description: number of bags disposed
 *              example:
 *                  userId: 34567gtfgyu67890mmkjm
 *                  date: 2022-05-17T12:46:47.215Z
 *                  impact: 333
 *                  material: {Umido, 1}
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
