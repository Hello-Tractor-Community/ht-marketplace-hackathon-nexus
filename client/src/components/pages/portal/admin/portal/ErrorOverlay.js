import React from 'react';
import { X, AlertCircle, FileWarning, RefreshCw, ClipboardCheck } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import Button from '../../../../common/button/Button';

import './SuccessOverlay.scss';
const ErrorOverlay = ({ onClose, onRetry }) => {
  return (
    <div 
   className='overlay-container'
    >
      <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <Button 
          onClick={onClose}
          className="close-btn"
          variant='mini'
        >
           <X className="h-5 w-5" />
           </Button>

        {/* Error icon and message */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="rounded-full bg-red-100 p-3 alert-icon-error">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <div className="space-y-2 success-title">
            <h3  className='success-title'>
              Oops! Something Went Wrong
            </h3>
            <p >
              Please check if server is live.
            </p>
          </div>

                 

          {/* Action buttons */}
          <div className="flex gap-3 w-full mt-4"
          style={{display: 'flex', alignItems: 'center', justifyContent:'flex-start', gap: '1rem'}}>
                       <Button 
            onClick={onRetry}
            variant='mini'
            > <RefreshCw className="h-4 w-4 alert-icon-error" 
            />Try Again</Button>         

            <Button 
            onClick={onClose}
            variant='mini'
            > <ClipboardCheck className="h-4 w-4 alert-icon-error" />Review Form</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorOverlay;
