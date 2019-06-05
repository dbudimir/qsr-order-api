const express = require('express');
const ChipotleOrder = require('../db/models/ChipotleOrder.js');

const router = express.Router();

router.get('/', (req, res) => {
    ChipotleOrder.find({}).then(allOrders => res.json(allOrders));
});

module.exports = router;
