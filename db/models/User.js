const mongoose = require('../connection.js');

const UserSchema = new mongoose.Schema({
    userFullName: { type: String },
    email: { type: String },
    chains: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chain',
        },
    ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
