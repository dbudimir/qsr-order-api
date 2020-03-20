const mongoose = require('../connection.js');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const UserSchema = new mongoose.Schema(
  {
    userFullName: { type: String },
    userName: { type: String, required: true, unique: true, maxlength: 20 },
    email: { type: String, index: true, unique: true, required: true },
    password: { type: String },
    orders: [
      {
        ref: 'Order',
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    favorites: [
      {
        ref: 'Order',
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(deepPopulate);
UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.comparePassword = function(plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
