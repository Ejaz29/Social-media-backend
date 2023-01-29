const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Please post a comment'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'A comment should belong to a post'],
  },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
