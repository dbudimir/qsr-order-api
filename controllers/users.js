const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../db/models/User.js');

const router = express.Router();

// Gets a list of users
router.get('/', (req, res) => {
  User.find({}).then(allUsers => res.json(allUsers));
});

// Gets a list of users with populated order information.
router.get('/all', (req, res) => {
  User.find({}).deepPopulate(['orders']).then(allUsers => res.json(allUsers));
});

// Gets a specific user by user name with orders
router.get('/:userName', async (req, res) => {
  User.find({ userName: req.params.userName })
    .populate({ path: 'orders', refPath: 'chainSchema', populate: { path: 'orderContent' } })
    .then(allUsers => res.json(allUsers));
});

// Gets a specific user by ID with orders
router.get('/id/:id', async (req, res) => {
  User.find({ _id: req.params.id })
    .populate({ path: 'orders', refPath: 'chainSchema', populate: { path: 'orderContent' } })
    .then(allUsers => res.json(allUsers));
});

// Create a user with the info below.
router.post('/create/:userFullName', (req, res) => {
  const newUser = JSON.parse(`{ "userFullName":"${req.params.userFullName}" }`);
  User.create(newUser).then(created => {
    res.json(created);
  });
});

// Creates a new user
router.post('/signup', async (req, res) => {
  try {
    var user = new User(req.body);
    var result = await user.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Exisitng User Login
router.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    var user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      res.send({
        message: 'The email does not exist',
        emailMatch: false
      });
      return res.status(400);
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        message: 'The password is invalid',
        passwordMatch: false
      });
      return res.status(400);
    }
    res.json({
      userId: user._id,
      userFullName: user.userFullName,
      userName: user.userName
    });
    res.send({ message: 'The email and password combination is correct!' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Not sure what this does.
router.get('/dump', async (req, res) => {
  try {
    var result = await User.find().exec();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a user by name
router.delete('/delete/:email', (req, res) => {
  User.findOneAndDelete({ email: req.params.email }).then(deleted => {
    res.json(deleted);
  });
});

module.exports = router;
