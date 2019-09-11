const express = require('express');
const router = express.Router();
const multer = require('multer');
const worker = require("../../utils/bgworkers/worker");
const { check, validationResult } = require('express-validator');
const orderService = require("../../utils/orderService");
let receivedDocumentData = {};


const storage = multer.diskStorage({
    fileFilter: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        if (extension !== "pdf") {
            return cb(new Error('Only pdf files are allowed!'), false);
        }
        cb(null, true);
    },
    destination: function (req, file, cb) {
        cb(null, './documents')
    },
    filename: function (req, file, cb) {
        let receivedMetadata = JSON.parse(req.body.filepond);
        receivedDocumentData = {
            documentCode: receivedMetadata.documentCode,
            orderID: receivedMetadata.orderID,
            fileName: file.originalname
        }
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage }).single("filepond")

//Add orders
router.post('/', (req, res, next) => {
    // orderService.addOrder(req.body)
    //     .then(user => user ? res.json(user) : res.status(404).send({ error: 'Try again later' }))
    //     .catch(err => next(err));

});

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersAdmin()
        .then(orders => orders ? res.json(orders) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/delete', (req, res, next) => {
    const { order } = req.body;
    orderService.deleteOrder(order)
        .then((ord) => {
            if (ord) {
                res.send({ msg: 'Order deleted!' });
            } else {
                res.status(404).send({ error: 'Try again later' });
            }
        })
        .catch(err => next(err));
})

router.post('/confirm', (req, res, next) => {
    const { user, order } = req.body;
    orderService.confirmOrder(order)
        .then((ord) => {
            if (ord) {
                res.send({ msg: 'Order confirmed!' });

                //Trigger a background process to send the email to the client
                sendEmail(user, order);
            } else {
                res.status(404).send({ error: 'Try again later' });
            }
        })
        .catch(err => next(err));
})

router.post('/ship', (req, res, next) => {
    const { user, order } = req.body;
    orderService.shipOrder(order)
        .then((ord) => {
            if (ord) {
                res.send({ msg: 'Order shipped!' });
                //Trigger a background process to send the shipping email to the client
                sendEmail(user, order);
            } else {
                res.status(404).send({ error: 'Try again later' });
            }
        })
        .catch(err => next(err));
})


router.post('/documents', (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        orderService.uploadDocument(receivedDocumentData)
            .then((msg) => {
                msg.nModified === 1 ? res.send({ msg: 'Document successfully added' }) : res.status(404).send({ error: 'Try again later' });
            })
            .catch((err) => {
                res.status(404).send({ error: 'Try again later' });
                next(err);
            });
    })
})

router.get('/file', (req, res, next) => {
    let documentCode = req.query.documentCode;
    let orderID = req.query.orderID;

    let isWithin = orderService.isDocumentInStorage(orderID, documentCode);
    if (isWithin === "") {
        return res.status(404).send({ error: 'Try again later' });
    }
    return res.download(`./documents/${isWithin}`);

})

function sendEmail(user, order) {
    orderService.getUserEmail(order.userID)
        .then((client) => {
            worker.addEmailJob(client.email, order, user)
        })
}

module.exports = router;
