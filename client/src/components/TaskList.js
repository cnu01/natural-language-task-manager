import React from 'react';
import TaskCard from './TaskCard';
import { CheckCircle, List } from 'lucide-react';

const TaskList = ({ tasks, onUpdateTask, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card p-8" style={{ textAlign: 'center' }}>
        <div className="animate-pulse">
          <div className="loading-skeleton w-1/4" style={{ margin: '0 auto 1rem auto' }}></div>
          <div className="space-y-4">
            <div className="loading-skeleton"></div>
            <div className="loading-skeleton w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="card p-8" style={{ textAlign: 'center' }}>
        <CheckCircle className="h-12" style={{ width: '3rem', height: '3rem', color: '#9ca3af', margin: '0 auto 1rem auto' }} />
        <h3 className="text-lg font-medium text-gray-900 mb-4">No tasks yet</h3>
        <p className="text-gray-500">
          Start by adding your first task using natural language above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <List className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Your Tasks ({tasks.length})
          </h2>
          <p className="text-sm text-gray-600">
            Manage and track your tasks
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
