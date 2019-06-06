const chains = require('../db/seeds/chains.json');
const Chain = require('./models/Chain.js');
const chipotleOrders = require('../db/seeds/chipotle-orders.json');
const ChipotleOrder = require('./models/ChipotleOrder.js');
const andPizzaOrders = require('../db/seeds/and-pizza-orders.json');
const AndPizzaOrder = require('./models/AndPizzaOrder.js');

Chain.find({}).deleteMany(() => {
    Chain.insertMany(chains).then(allChains => {
        ChipotleOrder.find({}).deleteMany(() => {
            const currentChain = allChains.filter(chain => chain.name === 'Chipotle');
            ChipotleOrder.insertMany(chipotleOrders).then(myOrders => {
                myOrders.forEach(order => {
                    currentChain[0].orders.push(order);
                });
                currentChain[0].save();
            });
        });
        AndPizzaOrder.find({}).deleteMany(() => {
            const currentChain = allChains.filter(chain => chain.name === '&pizza');
            AndPizzaOrder.insertMany(andPizzaOrders).then(myOrders => {
                myOrders.forEach(order => {
                    currentChain[0].orders.push(order);
                });
                currentChain[0].save();
            });
        });
    });
});
