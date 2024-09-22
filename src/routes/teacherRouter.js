const { teacherControllers } = require('../controllers');

const teacherRouter = require('express').Router();

teacherRouter.post('/', teacherControllers.registerTeacher);
teacherRouter.get('/', teacherControllers.getAllTeachers);
teacherRouter.get('/:id', teacherControllers.getTeacherById);

module.exports = teacherRouter;
