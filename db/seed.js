const chains = require('../db/seeds/chains.json');
const Chain = require('./models/Chain.js');
const users = require('./seeds/users.json');
const User = require('./models/User.js');
const chipotleOrders = require('../db/seeds/chipotle-orders.json');
const ChipotleOrder = require('./models/ChipotleOrder.js');
const andPizzaOrders = require('../db/seeds/and-pizza-orders.json');
const AndPizzaOrder = require('./models/AndPizzaOrder.js');

const Order = require('../db/models/Order.js');

function matchOrders(chainContent, chainContentOrders, chainSchemaName, currentChainName) {
  chainContent.find({}).deleteMany(() => {
    chainContent.insertMany(chainContentOrders).then(orders => {
      orders.forEach(order => {
        Order.updateOne(
          { timestamp: order.timestamp },
          {
            $push: { orderContent: order._id },
            $set: { contentSchema: chainSchemaName, chainName: currentChainName },
          },
          { upsert: true }
        ).then(updatedOrder => updatedOrder);
      });
    });
  });
}

function setValues(chainOrders, currentChain) {
  Order.insertMany(chainOrders).then(orders => {
    orders.forEach(order => {
      // Associate order => chain
      Chain.updateOne(
        { name: currentChain[0].name },
        { $push: { orders: order._id } },
        { upsert: true },
        function(err) {
          if (err) {
            console.log(err);
          }
        }
      );
      // Associate chain => order
      Order.updateOne(
        { chain: [] },
        { $push: { chain: currentChain[0]._id } },
        { upsert: true },
        function(err) {
          if (err) {
            console.log(err);
          }
        }
      );
      if (typeof order.userFullName === 'string') {
        User.updateOne(
          { userFullName: order.userFullName },
          { $push: { orders: order } },
          { upsert: true },
          function(err) {
            if (err) {
              console.log(err);
            }
          }
        );
        User.findOne({ userFullName: order.userFullName }).then(user => {
          Order.updateOne(
            { userFullName: order.userFullName, users: [] },
            { $push: { users: user._id } },
            { upsert: true },
            function(err) {
              if (err) {
                console.log(err);
              }
            }
          );
        });
      }
    });
  });
}

Chain.find({}).deleteMany(() => {
  Chain.insertMany(chains).then(allChains => {
    User.find({}).deleteMany(() => {
      User.insertMany(users).then(allUsers => {
        Order.find({})
          .deleteMany(() => {
            const currentChain = allChains.filter(chain => chain.name === 'Chipotle');
            setValues(chipotleOrders, currentChain, allUsers);
            matchOrders(ChipotleOrder, chipotleOrders, 'ChipotleOrder', 'Chipotle');
          })
          .then(() => {
            const currentChain = allChains.filter(chain => chain.name === '&pizza');
            setValues(andPizzaOrders, currentChain, allUsers);
            matchOrders(AndPizzaOrder, andPizzaOrders, 'AndPizzaOrder', '&pizza');
          });
      });
    });
  });
});
