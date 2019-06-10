const express = require('express');
const User = require('../db/models/User.js');

const router = express.Router();

// Gets a list of users
router.get('/', (req, res) => {
    User.find({}).then(allUsers => res.json(allUsers));
});

// Gets a list of users with populated order information.
router.get('/all', (req, res) => {
    User.find({})
        .deepPopulate(['orders'])
        .then(allUsers => res.json(allUsers));
});

// Gets a specific user by name with orders
router.get('/:userFullName', (req, res) => {
    User.find({ userFullName: req.params.userFullName })
        .populate({ path: 'orders', refPath: 'chainSchema', populate: { path: 'orderContent' } })
        .then(allUsers => res.json(allUsers));
});

// Create a usr with the info below.
router.post('/create/:userFullName', (req, res) => {
    const newUser = JSON.parse(`{ "userFullName":"${req.params.userFullName}" }`);
    User.create(newUser).then(created => {
        res.json(created);
    });
});

// Delete a user by name
router.delete('/delete/:userFullName', (req, res) => {
    User.findOneAndDelete({ userFullName: req.params.userFullName }).then(deleted => {
        res.json(deleted);
    });
});

module.exports = router;
