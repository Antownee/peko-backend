var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var shipmentSchema = new Schema({
    shipmentID: { type: String, unique: true },
    documents: [{
        fileName: String,
        documentCode: String,
        dateAdded: Date
    }],
    orderID: String,
    userID: String,
    shipmentDate: Date,
    shipmentValue: Number, //Amount the shipment is worth = contract value
    shipmentWeight: Number,
    orderShipped: Boolean
});


var shipmentModel = mongoose.model('Shipment', shipmentSchema);
module.exports = shipmentModel;