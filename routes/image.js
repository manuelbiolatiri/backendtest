const { Router } = require('express');
const verify = require('../controllers/register');
const comment = require('../controllers/comments');
const imgMiddleware = require('../middleware/image');

// configure route
const imageRouter = Router();

imageRouter.post('/posts/:id/image_comment', verify.verifyToken, imgMiddleware.checkPostImage, comment.postImage);

// export comment route to server.js
module.exports = imageRouter;