// COMMENT MODEL
var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
    owner_id: mongoose.Schema.Types.ObjectId,
    target_id: mongoose.Schema.Types.ObjectId,
    date: Date,
    comment: String,
    type: String
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
    Comment: Comment
}
