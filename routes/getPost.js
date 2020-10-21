const { Router } = require('express');
const verify = require('../controllers/register');
const getPosts = require('../controllers/getPosts');

// configure route 
const getRouter = Router();

getRouter.get('/feeds', verify.verifyToken ,getPosts.getAllposts);
getRouter.get('/posts/:id', verify.verifyToken ,getPosts.getSinglePost);

module.exports = getRouter;
