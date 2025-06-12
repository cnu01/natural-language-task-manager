import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorMessage = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="error-message">
      <div className="flex">
        <div style={{ flexShrink: 0 }}>
          <AlertTriangle className="h-4 w-4" style={{ color: '#dc2626' }} />
        </div>
        <div style={{ marginLeft: '0.75rem', flex: 1 }}>
          <p className="text-sm">
            {error}
          </p>
        </div>
        {onClose && (
          <div style={{ marginLeft: 'auto', paddingLeft: '0.75rem' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '0.25rem',
                color: '#dc2626'
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
