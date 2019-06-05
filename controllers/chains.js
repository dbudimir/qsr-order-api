const express = require('express');
const Chain = require('../db/models/Chain.js');

const router = express.Router();

router.get('/', (req, res) => {
    Chain.findOne({ name: 'Chipotle' })
        .populate('orders')
        .then(orders => res.json(orders));
});

module.exports = router;
