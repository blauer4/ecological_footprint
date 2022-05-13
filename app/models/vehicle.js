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