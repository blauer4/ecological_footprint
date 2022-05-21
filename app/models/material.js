/**
*    @swagger
*    components:
*        schemas:
*            Material:
*                type: object
*                required:
*                    - name
*                    - unitImpact
*                properties:
*                    name: 
*                        type: string
*                        description: the name of the material to dispose.
*                    unitImpact: 
*                        type: integer
*                        description: The value of the impact of a single unit of that material.
*                example:
*                    name: Umido
*                    unitImpact: 1
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var materialSchema = new Schema({
    name: {type:String, required:true},
    unitImpact: {type:String, required:true},
});

var Material = mongoose.model('Material', materialSchema);

module.exports = {
    Material,
    materialSchema
}