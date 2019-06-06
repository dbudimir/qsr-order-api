const express = require('express');
const Chain = require('../db/models/Chain.js');

const router = express.Router();

// Gets all of the chains and order IDs
router.get('/', (req, res) => {
    Chain.find({}).then(chains => res.json(chains));
});

// Gets full data for orders for the chain passed into the URL
router.get('/:chainOrder', (req, res) => {
    Chain.find({ orderSchema: req.params.chainOrder })
        .populate({
            path: 'orders',
            model: req.params.chainOrder,
        })
        .then(chains => res.json(chains));
});

module.exports = router;
