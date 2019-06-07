const mongoose = require('../connection.js');

const AndPizzaOrderSchema = new mongoose.Schema({
    dough: { type: String },
    sauce: [],
    cheese: [],
    veggies: [],
    proteins: [],
    finishes: [],
});

const AndPizzaOrder = mongoose.model('AndPizzaOrder', AndPizzaOrderSchema);

module.exports = AndPizzaOrder;
