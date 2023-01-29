const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'A user should have email'],
  },
  password: {
    type: String,
    required: [true, 'A user should have password'],
    select: false,
  },
  username: {
    type: String,
    required: [true, 'A user must have a username'],
  },
  numOfFollowers: {
    type: Number,
    default: 0,
  },
  numOfFollowing: {
    type: Number,
    default: 0,
  },
});

const user = mongoose.model('User', userSchema);
module.exports = user;
