const mongoose = require('../connection.js');

const ChipotleOrderSchema = new mongoose.Schema({
    mealType: { type: String },
    tortilla: { type: String },
    fillings: [],
    rice: { type: String },
    beans: { type: String },
    toppings: [],
});

const ChipotleOrder = mongoose.model('ChipotleOrder', ChipotleOrderSchema);

module.exports = ChipotleOrder;
