const express = require('express');
const Chain = require('../db/models/Chain.js');

const router = express.Router();

router.get('/', (req, res) => {
    Chain.find({}).then(chains => res.json(chains));
});

module.exports = router;
