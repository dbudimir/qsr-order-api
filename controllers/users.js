const express = require('express');
const jwt = require('jwt-simple');
const passport = require('../config/passport');
const config = require('../config/config');

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
router.post('/signup', (req, res) => {
	if (req.body.email && req.body.password) {
		let newUser = {
			email: req.body.email,
			password: req.body.password,
		};
		User.findOne({ email: req.body.email }).then(user => {
			if (!user) {
				User.create(newUser).then(user => {
					if (user) {
						var payload = {
							id: newUser.id,
						};
						var token = jwt.encode(payload, config.jwtSecret);
						res.json({
							token: token,
							userId: user._id,
						});
					} else {
						res.sendStatus(401);
					}
					res.json(user);
				});
			} else {
				res.sendStatus(401);
			}
		});
	} else {
		res.sendStatus(401);
	}
});

// Allows an existing user to log in
router.post('/login', (req, res) => {
	if (req.body.email && req.body.password) {
		User.findOne({ email: req.body.email }).then(user => {
			if (user) {
				if (user.password === req.body.password) {
					var payload = {
						id: user.id,
					};
					var token = jwt.encode(payload, config.jwtSecret);
					res.json({
						token: token,
						userId: user._id,
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
