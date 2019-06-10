const express = require('express');
const Chain = require('../db/models/Chain.js');

const router = express.Router();

// Gets all of the chains and order IDs
router.get('/', (req, res) => {
    Chain.find({})
        // .populate({
        //     path: 'orders',
        //     model: 'Order',
        //     populate: { path: 'orderContent', refPath: 'chainSchema' },
        // })
        .then(chains => res.json(chains));
});

// Gets full data for orders for the chain passed into the URL
router.get('/:chainName', (req, res) => {
    Chain.findOne({ name: req.params.chainName })
        .populate({
            path: 'orders',
            model: 'Order',
            populate: { path: 'orderContent', model: req.params.orderSchema },
        })
        .then(chains => res.json(chains));
});

module.exports = router;
