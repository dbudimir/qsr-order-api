const express = require('express');
const Order = require('../db/models/Order.js');

const router = express.Router();

// Gets all of the chains and order IDs
router.get('/', (req, res) => {
    Order.find({}).then(orders => res.json(orders));
});

router.get('/:id', (req, res) => {
    Order.find({ _id: req.params.id })
        .populate({
            path: 'orders',
            model: req.params.chainOrder,
        })
        .then(chains => res.json(chains));
});

module.exports = router;
