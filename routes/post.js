const { Router } = require('express');
const postController = require('../controllers/posts');
const  verify = require('../controllers/register');
// post middleware
const postMiddleware = require('../middleware/post');

// configure route
const postRouter = Router();

postRouter.post('/posts', verify.verifyToken, postMiddleware.checkPost_ModifyPost ,postController.createPost);
postRouter.put('/posts/:id', verify.verifyToken, postMiddleware.checkPost_ModifyPost ,postController.modifyPost);
postRouter.delete('/posts/:id', verify.verifyToken, postController.deletePost);

// export post route to server.js
module.exports = postRouter;
