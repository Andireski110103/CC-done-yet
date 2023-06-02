const express = require('express');
const router = express.Router();
const CommunityController = require('../controllers/communityController');

router.post('/posts', CommunityController.createPost);
router.get('/posts/:postId', CommunityController.getPostById);
router.post('/comments', CommunityController.createComment);

module.exports = router;
