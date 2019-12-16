const express = require('express');
const User = require('../db/models/User.js');
const Order = require('../db/models/Order.js');
const Chain = require('../db/models/Chain.js');

const router = express.Router();

// Anon create an order
router.post('/create/order', async (req, res) => {
  // Start the function
  Order.create(req.body.order).then(createdOrder => {
    const OrderContent = require(`../db/models/${createdOrder.contentSchema}.js`);
    OrderContent.create(req.body.order).then(async createdOrderContent => {
      Chain.findOne({ name: createdOrder.chainName })
        .then(async updatedChain => {
          updatedChain.orders.push(createdOrder._id);
          createdOrder.chain.push(updatedChain._id);
          updatedChain.save();
        })
        .then(async () => {
          createdOrder.orderContent.push(createdOrderContent._id);
          createdOrder.save();
          createdOrderContent.save();
        })
        .then(() => res.json(createdOrder));
    });
  });
});

// Find an existing user and create a new order.
router.post('/create/existing-user', async (req, res) => {
  // Start the function
  User.findOne({ _id: req.body.userId }).then(foundUser => {
    Order.create(req.body.order).then(createdOrder => {
      const OrderContent = require(`../db/models/${createdOrder.contentSchema}.js`);
      OrderContent.create(req.body.order).then(async createdOrderContent => {
        Chain.findOne({ name: createdOrder.chainName })
          .then(async updatedChain => {
            updatedChain.orders.push(createdOrder._id);
            createdOrder.chain.push(updatedChain._id);
            updatedChain.save();
          })
          .then(async () => {
            foundUser.orders.push(createdOrder._id);
            createdOrder.orderContent.push(createdOrderContent._id);
            createdOrder.users.push(foundUser._id);

            foundUser.save();
            createdOrder.save();
            createdOrderContent.save();
          })
          .then(() => res.json(createdOrder));
      });
    });
  });
});

// Create a user with the info below.
router.post('/create/new-user', async (req, res) => {
  // Start the function
  User.create(req.body.user).then(createdUser => {
    Order.create(req.body.order).then(createdOrder => {
      const OrderContent = require(`../db/models/${createdOrder.contentSchema}.js`);
      OrderContent.create(req.body.order).then(async createdOrderContent => {
        Chain.findOne({ name: createdOrder.chainName })
          .then(async updatedChain => {
            updatedChain.orders.push(createdOrder._id);
            createdOrder.chain.push(updatedChain._id);
            updatedChain.save();
          })
          .then(async () => {
            createdUser.orders.push(createdOrder._id);
            createdOrder.orderContent.push(createdOrderContent._id);
            createdOrder.users.push(createdUser._id);

            createdUser.save();
            createdOrder.save();
            createdOrderContent.save();
          })
          .then(() => res.json(createdOrder));
      });
    });
  });
});

module.exports = router;
