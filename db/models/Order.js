const mongoose = require('../connection.js');

const OrderSchema = new mongoose.Schema({
    timestamp: { type: String },
    userFullName: { type: String },
    orderName: { type: String },
    description: { type: String },
    chainSchema: { type: String },
    chain: [
        {
            ref: 'Chain',
            type: mongoose.Schema.Types.ObjectId,
            maxItems: 1,
        },
    ],
    users: [
        {
            ref: 'User',
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    orderContent: [
        {
            ref: this.chainSchema,
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
