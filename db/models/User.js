const mongoose = require('../connection.js');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
	userFullName: { type: String },
	userName: { type: String, required: true, unique: true },
	email: { type: String, index: true, unique: true, required: true },
	password: { type: String },
	orders: [
		{
			ref: 'Order',
			type: mongoose.Schema.Types.ObjectId,
		},
	],
});

const deepPopulate = require('mongoose-deep-populate')(mongoose);

UserSchema.plugin(deepPopulate);

const User = mongoose.model('User', UserSchema);

module.exports = User;
