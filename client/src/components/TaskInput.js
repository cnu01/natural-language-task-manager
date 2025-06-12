import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const TaskInput = ({ onAddTask, isLoading }) => {
  const [naturalText, setNaturalText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!naturalText.trim() || isLoading) return;

    try {
      await onAddTask(naturalText.trim());
      setNaturalText('');
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-input" className="block text-sm font-medium text-gray-700 mb-4">
            Describe your task in natural language
          </label>
          <textarea
            id="task-input"
            value={naturalText}
            onChange={(e) => setNaturalText(e.target.value)}
            placeholder="e.g., 'Send email to John by tomorrow at 3pm' or 'High priority: Review budget report assigned to Sarah'"
            className="form-textarea"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!naturalText.trim() || isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" style={{ marginRight: '0.5rem' }} />
                Processing...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                Add Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;
