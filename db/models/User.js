const mongoose = require('../connection.js');

const UserSchema = new mongoose.Schema({
    userFullName: { type: String },
    email: { type: String },
    orders: [
        {
            ref: 'Order',
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
