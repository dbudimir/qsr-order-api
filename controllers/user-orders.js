const express = require('express');
const User = require('../db/models/User.js');
const Order = require('../db/models/Order.js');
const Chain = require('../db/models/Chain.js');

const router = express.Router();

// Create a user with the info below.
router.post('/create/', (req, res) => {
    // Start the function
    User.create(req.body.user).then(createdUser => {
        Order.create(req.body.order).then(createdOrder => {
            const OrderContent = require(`../db/models/${createdOrder.contentSchema}.js`);
            OrderContent.create(req.body.order).then(createdOrderContent => {
                Chain.findOneAndUpdate({ orderSchema: createdOrder.contentSchema })
                    .then(updatedChain => {
                        // Send order ID to user schema
                        createdUser.orders.push(createdOrder._id);
                        // Send user ID to order schema
                        createdOrder.users.push(createdUser._id);
                        // Send order content ID to order
                        createdOrder.orderContent.push(createdOrderContent._id);
                        // Update the chain
                        updatedChain.orders.push(createdOrder._id);

                        createdUser.save();
                        createdOrder.save();
                        createdOrderContent.save();
                        updatedChain.save();
                    })
                    .then(() => res.json(createdOrder));
            });
        });
    });
});

module.exports = router;
