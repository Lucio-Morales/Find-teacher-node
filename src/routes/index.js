const teacherRouter = require('./teacherRouter');
const router = require('express').Router();

router.use('/teacher', teacherRouter);

module.exports = router;
