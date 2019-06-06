const express = require('express');
const User = require('../db/models/User.js');
const Chain = require('../db/models/Chain.js');

const router = express.Router();

// router.get('/', (req, res) => {
//     User.find({}).then(allUsers => res.json(allUsers));
// });

router.get('/', (req, res) => {
    User.find({})
        .populate({
            path: 'chains',
            select: 'name',
        })
        .then(allUsers => res.json(allUsers));
});

router.get('/orders/:userFullName', (req, res) => {
    User.find({ userFullName: req.params.userFullName })
        .populate({
            path: 'chains',
            populate: {
                path: 'orders',
                model: Chain.orderSchema,
                match: { userFullName: req.params.userFullName },
            },
        })
        .then(allUsers => res.json(allUsers));
});

router.post('/create/:userFullName', (req, res) => {
    const newUser = JSON.parse(`{ "userFullName":"${req.params.userFullName}" }`);
    User.create(newUser).then(created => {
        res.json(created);
    });
});

router.delete('/delete/:userFullName', (req, res) => {
    User.findOneAndDelete({ userFullName: req.params.userFullName }).then(deleted => {
        res.json(deleted);
    });
});

module.exports = router;
