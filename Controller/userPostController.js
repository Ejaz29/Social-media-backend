const Post = require('./../Models/postModel');
const Comment = require('./../Models/commentModel');
const catchAsync = require('./../Utils/catchAsync');
const appError = require('./../Utils/appError');
const mongoose = require('mongoose');

exports.getPost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.id).populate('comments', 'comment');
  if (!post) {
    return next(
      new appError('The post does not exist, please enter valid id', 400)
    );
  }
  res.status(200).json({
    status: 'success',
    likes: post.likes,
    numbOfComments: post.comments.length,
    comments: post.comments,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const post = await Post.create(req.body);
  res.status(201).json({
    status: 'success',
    id: post.id,
    title: post.title,
    description: post.description,
    createdTime: post.createdAt,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new appError('No post is found with that id', 400));
  }
  const id = new mongoose.Types.ObjectId(req.user.id);
  if (!id.equals(post.user)) {
    return next(
      new appError('This post can only be deleted by the owner', 400)
    );
  }
  await Post.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ post: post._id });
  res.status(204).json({
    status: 'success',
  });
});

exports.likePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (!post) {
    return next(new appError('The post does not exist', 400));
  }
  if (post.likedBy.includes(req.user.username)) {
    res.status(200).json({
      status: 'success',
      message: 'You have already liked the post',
    });
    return;
  }
  await Post.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 }, $push: { likedBy: req.user.username } },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
  });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (!post) {
    return next(new appError('The post does not exist', 400));
  }
  if (!post.likedBy.includes(req.user.username)) {
    res.status(200).json({
      status: 'success',
      message: 'You have not liked the post',
    });
    return;
  }
  await Post.findByIdAndUpdate(
    id,
    { $inc: { likes: -1 }, $pull: { likedBy: req.user.username } },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    user: new mongoose.Types.ObjectId(req.user.id),
  })
    .select('-user -__v')
    .populate('comments', 'comment');
  res.status(200).json({
    status: 'success',
    data: posts,
  });
});
