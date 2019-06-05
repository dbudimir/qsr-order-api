const chains = require('../db/chains.json');
const Chain = require('./models/Chain.js');
const chipotleOrders = require('../db/chipotle-orders.json');
const ChipotleOrder = require('./models/ChipotleOrder.js');

Chain.find({}).deleteMany(() => {
    Chain.insertMany(chains).then(allChains => allChains);
});

ChipotleOrder.find({}).deleteMany(() => {
    ChipotleOrder.insertMany(chipotleOrders).then(orders => orders);
});
