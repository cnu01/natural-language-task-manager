import React, { useState } from 'react';
import { FileText, Users, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import taskService from '../services/taskService';

const TranscriptParser = ({ onTasksCreated, isLoading, setIsLoading }) => {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleParseTranscript = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript to parse');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await taskService.parseTranscript(transcript.trim());
      setResult(response);
      onTasksCreated(response.data);
      setTranscript('');
    } catch (err) {
      setError(err.message || 'Failed to parse transcript');
    } finally {
      setIsLoading(false);
    }
  };

  const exampleTranscript = `Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight.`;

  const loadExample = () => {
    setTranscript(exampleTranscript);
    setError('');
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
      {/* Example Section */}
      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">Example:</span>
        </div>
        <p className="text-sm text-purple-700 mb-2 italic">
          "{exampleTranscript}"
        </p>
        <button
          onClick={loadExample}
          className="text-xs text-purple-600 hover:text-purple-800 font-medium"
          disabled={isLoading}
        >
          Load Example
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="transcript-input" className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Transcript
          </label>
          <textarea
            id="transcript-input"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
            className="form-textarea min-h-[100px]"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleParseTranscript}
            disabled={!transcript.trim() || isLoading}
            className="btn btn-primary bg-purple-600 hover:bg-purple-700 border-purple-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Parsing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Parse Transcript
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {result && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">{result.message}</p>
          </div>
        )}
      </div>

      {/* Compact Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          💡 Paste meeting transcripts to automatically extract tasks with assignees and deadlines
        </p>
      </div>
    </div>
  );
};

export default TranscriptParser;
