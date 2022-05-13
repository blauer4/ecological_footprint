let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let materialSchema = new Schema({
    name: {type:String, required:true},
    unitImpact: {type:String, required:true},
});

let Material = mongoose.model('Material', materialSchema);

module.exports = {
    Material,
    materialSchema
}