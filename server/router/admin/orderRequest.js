const express = require('express');
const router = express.Router();
const multer = require('multer')

const orderService = require("../../utils/orderService");
var documentNames = [];


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
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let fullName = `${file.originalname}.${extension}`;
        documentNames.push({ path: fullName });
        cb(null, fullName)
    }
})
const upload = multer({ storage: storage }).array('file');

//Might be useful later
router.post('/', (req, res, next) => {
    orderService.addOrder(req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
});

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersAdmin()
        .then(orders => orders ? res.json(orders) : res.sendStatus(404))
        .catch(err => next(err));
})


router.post('/confirm', (req, res, next) => {
    //Also, trigger a background worker to send those emails to people to be notified
    orderService.confirmOrder(req.body)
        .then((ord) => {
            ord.nModified === 1 ? res.json("Order confirmed.") : res.sendStatus(404);
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

        orderService.uploadDocuments(documentNames)
            .then((msg) => {
                documentNames = [];
                if (msg) {
                    return  res.send({ msg: 'Documents successfully submitted' })
                } else {
                    return res.status(500).send({ error: 'Try again later' });
                }
            })
            .catch((err) => {
                res.status(404).send({ error: 'Try again later' });
                next(err);
            });
    })
})


module.exports = router;
