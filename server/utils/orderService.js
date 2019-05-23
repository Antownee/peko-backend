const shortid = require('shortid');
const orderRequest = require("../models/orderRequest");
const Tea = require("../models/tea");
const Email = require("../models/email");

//Required
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


module.exports = {
    addTeaItem,
    addOrder,
    getAllOrdersUser,
    getAllOrdersAdmin,
    confirmOrder,
    uploadDocuments,
    addEmail
};

//USER
async function addOrder(orderParams) {
    //Sanitise
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
    const orderId = documents[0].path;
    const id = orderId.substr(0, orderId.indexOf('_'));
    const code = (orderId.split('_',2)[1]).split('.', 1)[0];
    //Include code in saving details
    const newDocs = documents.map((doc) => {
        return {
            path: doc.path,
            code
        }
    })
    return await orderRequest.updateOne({ orderRequestID: id }, { $push: { documents: newDocs } })
}

async function addTeaItem(tea) {
    //Sanitise
    const teaItem = new Tea({
        teaID: `CH-${shortid.generate()}`,
        teaName: tea.teaName,
        description: tea.teaDescription
    });

    if (await Tea.findOne({ teaID: teaItem.teaID })) {
        throw `Tea has already been created`;
    }

    await teaItem.save();
    return "Tea successfully added";
}

async function addTeaItem(tea) {
    //Sanitise
    const teaItem = new Tea({
        teaID: `CH-${shortid.generate()}`,
        teaName: tea.teaName,
        description: tea.teaDescription
    });

    if (await Tea.findOne({ teaID: teaItem.teaID })) {
        throw `Tea has already been created`;
    }

    await teaItem.save();
    return "Tea successfully added";
}

async function addEmail(e) {
    const em = new Email({ email: e.email })

    if (await Email.findOne({ email: em.email })) {
        return `Email has already been created`;
    }

    await em.save();
    return "Email successfully added";


}