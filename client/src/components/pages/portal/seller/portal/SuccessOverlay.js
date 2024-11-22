import React from 'react';
import { X, CheckCircle2, ShieldAlert } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const SuccessOverlay = ({ onClose }) => {
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
        zIndex: 9999,              // High z-index to appear on top of everything
      }}
      >


      <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success icon and message */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Successfully Created!
            </h3>
            <p className="text-gray-600">
              Your listing has been submitted and is now pending admin approval.
            </p>
          </div>

          {/* Admin review alert */}
          <AlertDialog.Root>
            <AlertDialog.Trigger className="bg-amber-50 border border-amber-200 p-4 flex items-center gap-2 rounded-md">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <div>
                <h4 className="text-amber-600 font-semibold">Under Review</h4>
                <p className="text-amber-700 text-sm">
                  An admin will review your listing shortly. You'll be notified once it's approved.
                </p>
              </div>
            </AlertDialog.Trigger>
          </AlertDialog.Root>

          {/* Action button */}
          <button
            onClick={onClose}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;
