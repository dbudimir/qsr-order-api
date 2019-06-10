const mongoose = require('../connection.js');

const AndPizzaOrderSchema = new mongoose.Schema({
    timestamp: { type: String },
    dough: { type: String },
    sauce: [],
    cheese: [],
    veggies: [],
    proteins: { type: Array },
    finishes: [],
});

const AndPizzaOrder = mongoose.model('AndPizzaOrder', AndPizzaOrderSchema);

module.exports = AndPizzaOrder;
