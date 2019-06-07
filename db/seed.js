const chains = require('../db/seeds/chains.json');
const Chain = require('./models/Chain.js');
const users = require('./seeds/users.json');
const User = require('./models/User.js');
const chipotleOrders = require('../db/seeds/chipotle-orders.json');
const ChipotleOrder = require('./models/ChipotleOrder.js');
const andPizzaOrders = require('../db/seeds/and-pizza-orders.json');
const AndPizzaOrder = require('./models/AndPizzaOrder.js');

const Order = require('../db/models/Order.js');

function chipotleContent() {
    ChipotleOrder.find({}).deleteMany(() => {
        ChipotleOrder.insertMany(chipotleOrders).then(orders => orders);
    });
}

function andPizzaContent() {
    AndPizzaOrder.find({}).deleteMany(() => {
        AndPizzaOrder.insertMany(andPizzaOrders).then(orders => orders);
    });
}

function setValues(chainOrders, currentChain) {
    Order.insertMany(chainOrders).then(orders => {
        orders.forEach(order => {
            currentChain[0].orders.push(order);
            order.chain.push(currentChain[0]._id);
            if (typeof order.userFullName === 'string') {
                User.find({ userFullName: order.userFullName }).then(user => {
                    user[0].orders.push(order);
                    user[0].save();
                });
            }
            order.save().then(() => currentChain[0].save());
        });
    });
}

// function matchOrders(chainOrders, currentChain) {
//    orders.forEach(order => {
// }

Chain.find({}).deleteMany(() => {
    Chain.insertMany(chains).then(allChains => {
        User.find({}).deleteMany(() => {
            User.insertMany(users).then(() => {
                Order.find({})
                    .deleteMany(() => {
                        const currentChain = allChains.filter(chain => chain.name === 'Chipotle');
                        setValues(chipotleOrders, currentChain);
                    })
                    .then(() => {
                        const currentChain = allChains.filter(chain => chain.name === '&pizza');
                        setValues(andPizzaOrders, currentChain);
                    });
            });
        });
    });
});

// Chain.find({}).deleteMany(() => {
//     Chain.insertMany(chains).then(allChains => {
//         User.find({}).deleteMany(() => {
//             User.insertMany(users).then(() => {
//                 Order.find({}).deleteMany(() => {
//                     Order.insertMany(chipotleOrders).then(() => {
//                         ChipotleOrder.find({})
//                             .deleteMany(() => {
//                                 const currentChain = allChains.filter(chain => chain.name === 'Chipotle');
//                                 Order.insertMany(chipotleOrders).then(myOrders => {
//                                     myOrders.forEach(order => {
//                                         currentChain[0].orders.push(order);
//                                     });
//                                     currentChain[0].save().then(() => {
//                                         myOrders.forEach(order => {
//                                             if (order.userFullName !== null) {
//                                                 User.find({ userFullName: order.userFullName }).then(user => {
//                                                     user[0].orders.push(order._id);
//                                                     user[0].save();
//                                                 });
//                                             }
//                                         });
//                                     });
//                                 });
//                             })
//                             .then(() => {
//                                 AndPizzaOrder.deleteMany(() => {
//                                     const currentChain = allChains.filter(chain => chain.name === '&pizza');
//                                     Order.insertMany(andPizzaOrders).then(myOrders => {
//                                         myOrders.forEach(order => {
//                                             currentChain[0].orders.push(order);
//                                         });
//                                         currentChain[0].save().then(() => {
//                                             myOrders.forEach(order => {
//                                                 if (order.userFullName !== null) {
//                                                     User.find({ userFullName: order.userFullName }).then(user => {
//                                                         user[0].orders.push(order._id);
//                                                         user[0].save();
//                                                     });
//                                                 }
//                                             });
//                                         });
//                                     });
//                                 });
//                             });
//                     });
//                 });
//             });
//         });
//     });
// });
