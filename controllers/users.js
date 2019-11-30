const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const passport = require('../config/passport');

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

// Gets a specific user by ID with orders
router.get('/:id', async (req, res) => {
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
  try {
    var user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(400).send({ message: 'The email does not exist' });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).send({ message: 'The password is invalid' });
    }
    //  var token = jwt.encode(payload, config.jwtSecret);
    res.json({
      // token: token,
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

// Allows an existing user to log in
router.post('/login', (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        if (user.password === req.body.password) {
          var payload = {
            id: user.id
          };
          var token = jwt.encode(payload, config.jwtSecret);
          res.json({
            token: token,
            userId: user._id,
            userFullName: user.userFullName,
            userName: user.userName
          });
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

// Delete a user by name
router.delete('/delete/:userFullName', (req, res) => {
  User.findOneAndDelete({ userFullName: req.params.userFullName }).then(deleted => {
    res.json(deleted);
  });
});

module.exports = router;
