const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  addresses: { type: [Schema.Types.Mixed] },
  name: { type: String },
  orders: { type: [Schema.Types.Mixed] }
});

// Add the pre-save middleware for password hashing
userSchema.pre('save', async function (next) {
  try {
    console.log('Middleware triggered');
    console.log('Plain text password:', this.password);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
  } catch (error) {
    console.error('Error in middleware:', error);
    next(error);
  }
});

const virtual = userSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model('User', userSchema);
