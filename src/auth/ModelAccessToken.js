// ACCESS TOKEN MODEL

var mongoose = require('mongoose');

var AccessTokenSchema = new mongoose.Schema({
    uid: [mongoose.Schema.Types.ObjectId]
});

var AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = {
    AccessToken: AccessToken
}