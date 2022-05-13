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