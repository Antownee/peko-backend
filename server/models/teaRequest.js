var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teaRequestSchema = new Schema({
    teaRequestID: { type: String, unique: true },
    requestDate: Date,
    teaID: String,
    amount: Number,
    notes: String
});


var teaRequestModel = mongoose.model('TeaRequest', teaRequestSchema);
module.exports = teaRequestModel;