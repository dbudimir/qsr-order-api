const express = require('express');
const User = require('../db/models/User.js');

const router = express.Router();

router.get('/', (req, res) => {
    User.find({}).then(allUsers => res.json(allUsers));
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
