import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ErrorMessage from './components/ErrorMessage';
import taskService from './services/taskService';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoadingTasks(true);
      const response = await taskService.getAllTasks();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleAddTask = async (naturalText) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await taskService.createTask(naturalText);
      setTasks(prevTasks => [response.data, ...prevTasks]);
    } catch (err) {
      setError(err.message || 'Failed to create task. Please try again.');
      throw err; // Re-throw to prevent form reset
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const response = await taskService.updateTask(id, updates);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === id ? response.data : task
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update task. Please try again.');
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ErrorMessage error={error} onClose={clearError} />
        
        <TaskInput 
          onAddTask={handleAddTask} 
          isLoading={isLoading}
        />
        
        <TaskList
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          isLoading={isLoadingTasks}
        />
      </main>
    </div>
  );
}

export default App;
