const mongoose = require('../connection.js');

const OrderSchema = new mongoose.Schema(
  {
    userFullName: { type: String },
    orderName: { type: String },
    description: { type: String },
    tags: [],
    favoriteCount: { type: Number, default: 0 },
    chain: [
      {
        ref: 'Chain',
        type: mongoose.Schema.Types.ObjectId,
        maxItems: 1
      }
    ],
    users: [
      {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    usersFavorited: [
      {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    orderContent: [
      {
        refPath: 'contentSchema',
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    contentSchema: { type: String },
    chainName: { type: String }
  },
  {
    timestamps: true
  }
);

const deepPopulate = require('mongoose-deep-populate')(mongoose);

OrderSchema.plugin(deepPopulate);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
