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
    shipmentDate: Date,
    shipmentValue: Number, //Amount the shipment is worth = contract value
    orderShipped: Boolean
});


var shipmentModel = mongoose.model('Shipment', shipmentSchema);
module.exports = shipmentModel;