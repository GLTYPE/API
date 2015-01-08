// MOMENT MODEL
var mongoose = require("mongoose");

var MomentSchema = new mongoose.Schema({
    name: String,
    owner_id: mongoose.Schema.Types.ObjectId,
    target_id: mongoose.Schema.Types.ObjectId,
    date: Date,
    description: String,
    picture: String,
    comments: [mongoose.Schema.Types.ObjectId]
});

var Moment = mongoose.model('Moment', MomentSchema);

module.exports = {
  Moment: Moment
}
