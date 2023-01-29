const express = require('express');
const userController = require('./../Controller/userController');
const userPostController = require('./../Controller/userPostController');
const commentController = require('./../Controller/commentController');
const router = express.Router();

router.get('/posts/:id', userPostController.getPost);

router.post('/authenticate', userController.authenticate);

router.use(userController.protect);

router.get('/user', userController.getUser);
router.post('/follow/:id', userController.follow);
router.post('/unfollow/:id', userController.unfollow);

router.post('/post', userPostController.createPost);
router.delete('/posts/:id', userPostController.deletePost);
router.post('/like/:id', userPostController.likePost);
router.post('/unlike/:id', userPostController.unlikePost);
router.get('/all_posts', userPostController.getAllPosts);

router.get('/comment', commentController.getComments);
router.post('/comment/:id', commentController.postComment);
module.exports = router;
