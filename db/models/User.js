const mongoose = require('../connection.js');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema(
  {
    userFullName: { type: String },
    userName: { type: String, required: true, unique: true },
    email: { type: String, index: true, unique: true, required: true },
    password: { type: String },
    orders: [
      {
        ref: 'Order',
        type: mongoose.Schema.Types.ObjectId
      }
    ]
  },
  {
    timestamps: true
  }
);

const deepPopulate = require('mongoose-deep-populate')(mongoose);
UserSchema.plugin(deepPopulate);
UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
UserSchema.methods.comparePassword = function(plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
