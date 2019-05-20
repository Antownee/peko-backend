const shortid = require('shortid');
const orderRequest = require("../models/orderRequest");

//Required
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


module.exports = {
    addOrder,
    getAllOrdersUser,
    getAllOrdersAdmin,
    confirmOrder,
    uploadDocuments
};

//USER
async function addOrder(orderParams) {
    const order = new orderRequest({
        orderRequestID: `ORQ-${shortid.generate()}`,
        requestDate: Date.now().toString(),
        teaID: orderParams.teaID,
        amount: orderParams.amount,
        notes: orderParams.description,
        userID: orderParams.userID,
        confirmed: false
    })

    if (await orderRequest.findOne({ orderRequestID: order.orderRequestID })) {
        throw `Order has already been created`;
    }

    await order.save();
    return "Order successfully added";
}

async function getAllOrdersUser(orderParams) {
    return await orderRequest.find({ userID: orderParams.userID });
}

//ADMIN
async function getAllOrdersAdmin() {
    return await orderRequest.find({});
}

async function confirmOrder(order) {
    return await orderRequest.updateOne({ orderRequestID: order.orderRequestID }, { confirmed: true })
}

async function uploadDocuments(documents) {
    //get order id
    if (documents.length > 0) {
        const orderId = documents[0].path;
        const id = orderId.substr(0, orderId.indexOf('_'));
        return await orderRequest.updateOne({ orderRequestID: id }, { documents: documents })
    }
}
