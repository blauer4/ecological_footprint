var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    totalImpact: { type: Number, required: true },
    friends: { type: [{ id: Schema.ObjectId, username: String}], required: false}
});

var User = mongoose.model("User",userSchema);

module.exports = {
    User,
    userSchema
};