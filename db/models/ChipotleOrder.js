const mongoose = require('../connection.js');

const ChipotleOrderSchema = new mongoose.Schema({
    timestamp: { type: String },
    mealType: { type: String },
    tortilla: { type: String },
    fillings: [],
    rice: { type: String },
    beans: { type: String },
    toppings: [],
    orderName: { type: String },
    description: { type: String },
    chainName: { type: String, value: 'Chipotle' },
    userFullName: { type: String },
    users: [
        {
            ref: 'User',
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
});

const ChipotleOrder = mongoose.model('ChipotleOrder', ChipotleOrderSchema);

module.exports = ChipotleOrder;
