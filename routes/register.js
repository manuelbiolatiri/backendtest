const { Router } = require('express');
const signLogin =require('../controllers/register');
// import user middleware
const registerMiddleware = require('../middleware/register');

// configure route
const userRouter = Router();

userRouter.post('/signup', registerMiddleware.checkSignUp ,signLogin.signUP);
userRouter.post('/signin', signLogin.logIn);

// export user route to server.js
module.exports = userRouter;