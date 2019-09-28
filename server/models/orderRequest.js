const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderRequestSchema = new Schema({
    orderRequestID: { type: String, unique: true },
    userID: String,
    confirmed: Boolean,
    requestDate: { type: Date },
    orderStatus: String,
    teaOrders: [{
        teaName: String,
        weight: Number
    }],
    contract: {
        fileName: String,
        dateAdded: Date
    },
    documents: [{
        fileName: String,
        documentCode: String,
        dateAdded: Date
    }]
});


const orderRequestModel = mongoose.model('OrderRequest', orderRequestSchema);
module.exports = orderRequestModel;