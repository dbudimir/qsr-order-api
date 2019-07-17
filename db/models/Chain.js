const mongoose = require('../connection.js');

const ChainSchema = new mongoose.Schema(
	{
		name: { type: String },
		cuisine: { type: String },
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Order',
			},
		],
	},
	{
		timestamps: true,
	}
);

const Chain = mongoose.model('Chain', ChainSchema);

module.exports = Chain;
