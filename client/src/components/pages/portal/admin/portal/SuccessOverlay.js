import React from 'react';
import { X, CheckCircle2, ShieldAlert } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import Button from '../../../../common/button/Button';
import './SuccessOverlay.scss';

const SuccessOverlay = ({ onClose }) => {
  return (
    <div 
       className = 'overlay-container' >


      <div >
        {/* Close button */}
        <Button 
          onClick={onClose}
          className="close-btn"
          variant='mini'

        >
          <X className="h-5 w-5" />
        </Button>

        {/* Success icon and message */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600 alert-icon" />
          </div>
          
          <div className="space-y-2 success-title">
            <h3 
             className='success-title'
            >
              Successfully Created!
            </h3>
           
          </div>

          {/* Action button */}
          <Button
            onClick={onClose}
           
            variant='secondary'
          >
            Got it, thanks!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;
