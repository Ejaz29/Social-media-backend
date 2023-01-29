const Comment = require('./../Models/commentModel');
const catchAsync = require('./../Utils/catchAsync');
const Post = require('./../Models/postModel');
const appError = require('./../Utils/appError');

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();
  res.status(200).json({
    status: 'success',
    data: comments,
  });
});

exports.postComment = catchAsync(async (req, res, next) => {
  req.body.post = req.params.id;
  if (!(await Post.findById(req.params.id))) {
    return next(
      new appError('This post does not exist, please check the id', 400)
    );
  }
  const comment = await Comment.create(req.body);
  res.status(201).json({
    status: 'success',
    id: comment.id,
  });
});
