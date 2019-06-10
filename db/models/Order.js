const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongoose = require('../connection.js');

const OrderSchema = new mongoose.Schema({
    timestamp: { type: String },
    userFullName: { type: String },
    orderName: { type: String },
    description: { type: String },
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
            refPath: 'contentSchema',
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    contentSchema: { type: String },
    chainName: { type: String },
});

OrderSchema.plugin(deepPopulate);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
