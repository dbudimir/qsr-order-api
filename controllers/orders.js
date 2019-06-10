const express = require('express');
require('async');

const Order = require('../db/models/Order.js');

const router = express.Router();

router.get('/', (req, res) => {
    Order.find({})
        .deepPopulate(['chain', 'users', 'orderContent'])
        .populate({ path: 'orderContent', refPath: 'chainSchema' })
        .then(orders => res.json(orders));
});

// Gets all orders from a specific chain by name
router.get('/chain/:name', async (req, res) => {
    Order.find({ chainName: req.params.name })
        .populate({ path: 'orderContent', refPath: 'chainSchema' })
        .then(orders => res.json(orders));
});

router.get('/id/:id', async (req, res) => {
    Order.find({ _id: req.params.id })
        .populate({ path: 'orderContent', refPath: 'chainSchema' })
        .then(orders => res.json(orders));
});

// This function is redundant but it does make it possible to produce a result
// based on criteria in a sub document.
router.get('/chain/nested/:name', async (req, res) => {
    const chainOrders = [];
    const results = [];
    await Order.find({}, function(err, data) {
        data.forEach(function(value) {
            chainOrders.push(value);
        });
    })
        .deepPopulate(['chain', 'users', 'orderContent'])
        .populate({ path: 'chain', refPath: 'chainSchema' });
    chainOrders.forEach(order => {
        if (order.chain[0].name === req.params.name) {
            results.push(order);
        }
    });
    res.send(results);
});

module.exports = router;
