const mongoose = require('../connection.js');

const AndPizzaOrderSchema = new mongoose.Schema({
    timestamp: { type: String },
    dough: { type: String },
    sauce: [],
    cheese: [],
    veggies: [],
    proteins: [],
    finishes: [],
    orderName: { type: String },
    description: { type: String },
    chainName: { type: String, value: '&pizza' },
    userFullName: { type: String },
    users: [
        {
            ref: 'User',
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
});

const AndPizzaOrder = mongoose.model('AndPizzaOrder', AndPizzaOrderSchema);

module.exports = AndPizzaOrder;
