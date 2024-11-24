import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const MessageStatus = ({ error, success, onClose }) => {
  if (!error && !success) return null;

  return (
    <div className="fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg animate-fade-in">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaTimesCircle className="text-red-500 text-xl" />
              <span className="text-red-700 font-medium">
                Error sending message. We're sorry. Please try again later.
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Close message"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="text-green-700 font-medium">
                Message sent successfully!
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-green-400 hover:text-green-600 transition-colors"
              aria-label="Close message"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageStatus;