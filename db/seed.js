const chains = require('../db/chains.json');
const Chain = require('./models/Chain.js');
const chipotleOrders = require('../db/chipotle-orders.json');
const ChipotleOrder = require('./models/ChipotleOrder.js');

Chain.find({}).deleteMany(() => {
    Chain.insertMany(chains).then(allChains => {
        ChipotleOrder.find({}).deleteMany(() => {
            ChipotleOrder.insertMany(chipotleOrders).then(myOrders => {
                myOrders.forEach(order => {
                    allChains[0].orders.push(order);
                });
                allChains[0].save();
            });
        });
    });
});
