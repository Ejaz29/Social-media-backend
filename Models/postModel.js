const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title'],
    },
    description: {
      type: String,
      required: [true, 'A post must have a description'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: Array,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

const post = mongoose.model('Post', postSchema);
module.exports = post;
