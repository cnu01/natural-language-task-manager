import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TranscriptParser from './components/TranscriptParser';
import ErrorMessage from './components/ErrorMessage';
import taskService from './services/taskService';
import { FileText, ChevronDown, ChevronUp, Plus } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [error, setError] = useState(null);
  const [showTranscriptParser, setShowTranscriptParser] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);

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

  const handleTasksCreated = (newTasks) => {
    setTasks(prevTasks => [...newTasks, ...prevTasks]);
    setError(null);
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
        
        {/* Add New Task Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowTaskInput(!showTaskInput)}
            className="flex items-center gap-2 w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-800">Add New Task</h3>
              <p className="text-sm text-gray-600">
                Create tasks using natural language
              </p>
            </div>
            <div className="text-blue-600">
              {showTaskInput ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>
          
          {showTaskInput && (
            <div className="mt-4">
              <TaskInput 
                onAddTask={handleAddTask} 
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
        
        {/* Transcript Parser Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowTranscriptParser(!showTranscriptParser)}
            className="flex items-center gap-2 w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-800">AI Transcript Parser</h3>
              <p className="text-sm text-gray-600">
                Extract multiple tasks from meeting transcripts
              </p>
            </div>
            <div className="text-purple-600">
              {showTranscriptParser ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>
          
          {showTranscriptParser && (
            <div className="mt-4">
              <TranscriptParser 
                onTasksCreated={handleTasksCreated}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
        </div>
        
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
