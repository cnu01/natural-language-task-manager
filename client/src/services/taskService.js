import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class TaskService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async createTask(naturalText) {
    try {
      const response = await this.api.post('/tasks', { naturalText });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  }

  async getAllTasks() {
    try {
      const response = await this.api.get('/tasks');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  async updateTask(id, updates) {
    try {
      const response = await this.api.patch(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update task');
    }
  }
}

export default new TaskService();
