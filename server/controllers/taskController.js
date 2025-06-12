const taskService = require('../services/taskService');

class TaskController {
  async createTask(req, res) {
    try {
      const { naturalText } = req.body;

      if (!naturalText || typeof naturalText !== 'string' || naturalText.trim().length === 0) {
        return res.status(400).json({
          error: 'naturalText is required and must be a non-empty string'
        });
      }
      console.log('Received naturalText:', naturalText);

      const task = await taskService.createTask(naturalText.trim());
      
      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error in createTask controller:', error);
      res.status(500).json({
        error: error.message || 'Internal server error'
      });
    }
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      
      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error in getAllTasks controller:', error);
      res.status(500).json({
        error: error.message || 'Internal server error'
      });
    }
  }

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Remove fields that shouldn't be updated directly
      delete updates._id;
      delete updates.__v;
      delete updates.createdAt;
      delete updates.updatedAt;

      const task = await taskService.updateTask(id, updates);
      
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error in updateTask controller:', error);
      
      if (error.message === 'Task not found') {
        return res.status(404).json({
          error: 'Task not found'
        });
      }
      
      res.status(500).json({
        error: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = new TaskController();
