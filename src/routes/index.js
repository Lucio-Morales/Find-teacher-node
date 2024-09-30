const userController = require('./userRouter');

const router = require('express').Router();

router.use('/user', userController);

module.exports = router;
