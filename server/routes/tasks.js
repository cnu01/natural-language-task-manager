const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// POST /api/tasks - Create a new task from natural language
router.post('/', taskController.createTask);

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks);

// PATCH /api/tasks/:id - Update a task
router.patch('/:id', taskController.updateTask);

module.exports = router;
