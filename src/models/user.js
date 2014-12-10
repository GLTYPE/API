// USER MODEL

/* USER ROLE :
 * 1 : consumer
 * 2 : food supplier
 * 3 : gastronomist
 * 4 : admin
 */

var mongoose = require("mongoose"),
    uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    picture: String,
    about: String,
    email: {type: String, unique: true, background: false},
    moments: [mongoose.Schema.Types.ObjectId],
    role: Number,
    movies: [mongoose.Schema.Types.ObjectId],
    photos: [mongoose.Schema.Types.ObjectId],
    password: String
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    delete obj.__v
    return obj
}

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
}
