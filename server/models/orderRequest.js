var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderRequestSchema = new Schema({
    orderRequestID: { type: String, unique: true },
    userID: String,
    requestDate: Date,
    teaID: String,
    amount: Number,
    notes: String,
    confirmed: Boolean
});


var orderRequestModel = mongoose.model('OrderRequest', orderRequestSchema);
module.exports = orderRequestModel;