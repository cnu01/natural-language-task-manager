import React, { useState } from 'react';
import { Edit, Save, X, User, Calendar, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onUpdateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    task_name: task.task_name,
    assignee: task.assignee || '',
    due_datetime: task.due_datetime ? new Date(task.due_datetime).toISOString().slice(0, 16) : '',
    priority: task.priority
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-800 border-red-200';
      case 'P2': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'P3': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'P4': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };



  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = async () => {
    try {
      const updates = {
        task_name: editData.task_name,
        assignee: editData.assignee || null,
        due_datetime: editData.due_datetime ? new Date(editData.due_datetime).toISOString() : null,
        priority: editData.priority
      };
      
      await onUpdateTask(task._id, updates);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleCancel = () => {
    setEditData({
      task_name: task.task_name,
      assignee: task.assignee || '',
      due_datetime: task.due_datetime ? new Date(task.due_datetime).toISOString().slice(0, 16) : '',
      priority: task.priority
    });
    setIsEditing(false);
  };



  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {isEditing ? (
        // Edit Mode
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
            <input
              type="text"
              value={editData.task_name}
              onChange={(e) => setEditData({ ...editData, task_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <input
                type="text"
                value={editData.assignee}
                onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                placeholder="Enter assignee name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="datetime-local"
                value={editData.due_datetime}
                onChange={(e) => setEditData({ ...editData, due_datetime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="P1">P1 - Urgent</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Normal</option>
                <option value="P4">P4 - Low</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{task.task_name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-2 py-1 text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {task.assignee && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                Assigned to: {task.assignee}
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Due: {formatDate(task.due_datetime)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {task.priority}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 italic">
            Original: "{task.natural_text}"
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
