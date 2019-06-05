const mongoose = require('../connection.js');

const ChainSchema = new mongoose.Schema({
    name: { type: String },
    cuisine: { type: String },
    orderSchema: { type: String },
    orders: [
        {
            ref: this.orderSchema,
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
});

const Chain = mongoose.model('Chain', ChainSchema);

module.exports = Chain;
