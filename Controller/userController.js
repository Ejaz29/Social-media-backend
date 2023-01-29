const User = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('./../Utils/catchAsync');
const appError = require('./../Utils/appError');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    username: user.username,
    numberOfFollowers: user.numOfFollowers,
    numberOfFollowing: user.numOfFollowing,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new appError('You are not logged in, Please log in', 400));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new appError('User doesnot exist', 401));
  }
  req.user = user;
  next();
});

exports.authenticate = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Email or password is missing', 401));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || password !== user.password) {
    return next(new appError('Incorrect id or password', 401));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: 'success',
    token,
    data: user,
  });
});

exports.follow = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (id === req.user.id) {
    return next(new appError('Cannot follow yourself', 401));
  }
  if (!(await User.findById(id))) {
    return next(new appError('Cannot find the user, please check the id', 401));
  }
  await User.findByIdAndUpdate(
    id,
    { $inc: { numOfFollowers: 1 } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { numOfFollowing: 1 } },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
  });
});

exports.unfollow = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (id === req.user.id) {
    return next(new appError('Cannot unfollow yourself', 401));
  }
  const other = await User.findById(id);
  if (!other) {
    return next(new appError('Cannot find the user, please check the id', 401));
  }
  const owner = await User.findById(req.user.id);
  if (owner.numOfFollowing == 0) {
    return next(
      new appError('num of following cannot be reduced as it is already 0', 401)
    );
  }
  if (other.numOfFollowers == 0) {
    return next(
      new appError('num of followers cannot be reduced below 0', 401)
    );
  }
  await User.findByIdAndUpdate(
    id,
    { $inc: { numOfFollowers: -1 } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { numOfFollowing: -1 } },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
  });
});
