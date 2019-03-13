var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teaRequestSchema = new Schema({
    teaRequestID: { type: String, unique: true },
    requestDate: Date,
    teaID: String   
});


var teaRequestModel = mongoose.model('TeaRequest', teaRequestSchema);
module.exports = teaRequestModel;