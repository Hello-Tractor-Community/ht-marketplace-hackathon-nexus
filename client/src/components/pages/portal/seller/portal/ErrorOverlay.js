import React from 'react';
import { X, AlertCircle, FileWarning, RefreshCw, ClipboardCheck } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const ErrorOverlay = ({ onClose, onRetry }) => {
  return (
    <div 
    style={{
        position: 'fixed',         // Makes the element fixed relative to the viewport
        top: '25%',                    // Positions at the top of the viewport
        left: '25%',                   // Positions at the left of the viewport
        maxWidth: '50%',            // Full width of the viewport
        // height: '20vh',           // Full height of the viewport
        display: 'flex',           // Uses Flexbox for centering
        alignItems: 'center',      // Vertically centers the content
        justifyContent: 'center',  // Horizontally centers the content
        backgroundColor: 'hsl(193.47 73.13% 39.41%)', // Semi-transparent black background
        zIndex: 9999,      
      }}
    >
      <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Error icon and message */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Oops! Something Went Wrong
            </h3>
            <p className="text-gray-600">
              We couldn't create your listing at the moment. Don't worry, here's what you can do:
            </p>
          </div>

          {/* Troubleshooting suggestions */}
          <div className="w-full space-y-3 mt-2">
            <AlertDialog.Root>
              <AlertDialog.Trigger className="bg-gray-50 border border-gray-200 p-4 flex items-center gap-2 rounded-md">
                <ClipboardCheck className="h-4 w-4 text-gray-600" />
                <div>
                  <h4 className="text-gray-700 font-semibold">Check Your Form</h4>
                  <p className="text-gray-600 text-sm">Make sure all required fields are filled out correctly.</p>
                </div>
              </AlertDialog.Trigger>
            </AlertDialog.Root>

            <AlertDialog.Root>
              <AlertDialog.Trigger className="bg-blue-50 border border-blue-200 p-4 flex items-center gap-2 rounded-md">
                <FileWarning className="h-4 w-4 text-blue-600" />
                <div>
                  <h4 className="text-blue-700 font-semibold">Common Issues</h4>
                  <p className="text-blue-600 text-sm">
                    • Images might be too large<br />
                    • Price format should be numeric<br />
                    • Special characters in description
                  </p>
                </div>
              </AlertDialog.Trigger>
            </AlertDialog.Root>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={onRetry}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Review Form
            </button>
          </div>

          {/* Support link */}
          <p className="text-sm text-gray-500 mt-2">
            Still having trouble? <a href="#" className="text-red-600 hover:text-red-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorOverlay;
