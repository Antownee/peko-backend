const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderRequestSchema = new Schema({
    orderRequestID: { type: String, unique: true },
    userID: String,
    requestDate: { type: Date },
    teaID: String,
    amount: Number, //Weight
    notes: String,
    confirmed: Boolean,
    documents: [{
        fileName: String,
        documentCode: String,
        dateAdded: Date
    }], 
    contract: {
        contractID: String,
        isSumbitted: Boolean
    },
    orderPosition: Number,
    orderShipped: Boolean
});


const orderRequestModel = mongoose.model('OrderRequest', orderRequestSchema);
module.exports = orderRequestModel;