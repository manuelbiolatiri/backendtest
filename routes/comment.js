const { Router } = require('express');
const verify = require('../controllers/register');
const comment = require('../controllers/comments');

// configure route
const commentRouter = Router();

commentRouter.post('/posts/:id/comment', verify.verifyToken, comment.postComment);
commentRouter.delete('/comment/:id', verify.verifyToken, comment.deleteComment);

// export comment route to server.js
module.exports = commentRouter;