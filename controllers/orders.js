const express = require('express');
require('async');

const Order = require('../db/models/Order.js');
const User = require('../db/models/User.js');

const router = express.Router();

router.get('/', (req, res) => {
  Order.find({})
    .deepPopulate(['chain', 'users', 'orderContent'])
    .populate({ path: 'orderContent', refPath: 'chainSchema' })
    .then(orders => res.json(orders));
});

// Gets all orders from a specific chain by name
router.get('/chain/:name', async (req, res) => {
  Order.find({ chainName: req.params.name })
    .populate({ path: 'orderContent', refPath: 'chainSchema' })
    .then(orders => res.json(orders));
});

// Gets a specific order by ID
router.get('/id/:id', async (req, res) => {
  Order.find({ _id: req.params.id })
    .populate({ path: 'users' })
    .populate({ path: 'orderContent', refPath: 'chainSchema' })
    .then(orders => res.json(orders));
});

// Finds all orders with a specific tag
router.get('/tag/:tag', async (req, res) => {
  Order.find({ tags: req.params.tag })
    .populate({ path: 'users' })
    .populate({ path: 'orderContent', refPath: 'chainSchema' })
    .then(orders => res.json(orders));
});

// Finds all orders with a specific tag at a specifc chain
router.get('/chain/:chain/:tag', async (req, res) => {
  Order.find({ $and: [{ chainName: req.params.chain }, { tags: req.params.tag }] })
    .populate({ path: 'users' })
    .populate({ path: 'orderContent', refPath: 'chainSchema' })
    .then(orders => res.json(orders));
});

// Finds all orders that have tags
router.get('/tags', async (req, res) => {
  Order.find({ tags: { $exists: true }, $where: 'this.tags.length>0' })
    .populate({ path: 'users' })
    .populate({ path: 'orderContent', refPath: 'chainSchema' })
    .then(order => res.json(order));
});

// Makes it possible to produce a result based on criteria in a sub document.
router.get('/chain-nested/:name', async (req, res) => {
  const chainOrders = [];
  const results = [];
  await Order.find({}, function(err, data) {
    data.forEach(function(value) {
      chainOrders.push(value);
    });
  })
    .deepPopulate(['users', 'orderContent'])
    .populate({ path: 'chain', refPath: 'chainSchema' });
  chainOrders.forEach(order => {
    if (order.chain[0].name === req.params.name) {
      results.push(order);
    }
  });
  res.send(results);
});

// Produces all orders that contain black beans or pinto beans.
router.get('/beans/:beans', async (req, res) => {
  const chainOrders = [];
  const results = [];
  await Order.find({}, function(err, data) {
    data.forEach(function(value) {
      chainOrders.push(value);
    });
  })
    .deepPopulate(['users', 'orderContent'])
    .populate({ path: 'orderContent' });
  chainOrders.forEach(order => {
    if (order.orderContent[0].beans === req.params.beans) {
      results.push(order);
    }
  });
  res.send(results);
});

// Increments favorite count on selected order and adds favorite to User
router.post('/favorite', async (req, res) => {
  console.log(req.body);
  try {
    let result = {
      order: Order.updateOne(
        { _id: req.body.orderId },
        { $inc: { favoriteCount: 1 }, $addToSet: { usersFavorited: req.body.userId } }
      ).exec(),
      user: User.updateOne(
        { _id: req.body.userId },
        { $addToSet: { favorites: req.body.orderId } }
      ).exec()
    };
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Decrement favorite count on selected order removes favorite from user
router.post('/unfavorite', async (req, res) => {
  console.log(req.body);
  try {
    let result = {
      order: Order.updateOne(
        { _id: req.body.orderId },
        { $inc: { favoriteCount: -1 }, $pull: { usersFavorited: req.body.userId } }
      ).exec(),
      user: User.updateOne(
        { _id: req.body.userId },
        { $pullAll: { favorites: req.body.orderId } }
      ).exec()
    };
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
