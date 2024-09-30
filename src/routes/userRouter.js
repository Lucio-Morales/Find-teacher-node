const { userController, authUser } = require('../controllers');

const userRouter = require('express').Router();

userRouter.post('/', userController.registerUser);
userRouter.post('/login', authUser.loginUser);
userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUserById);

module.exports = userRouter;
