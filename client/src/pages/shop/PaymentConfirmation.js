import React, { useEffect, useState } from 'react';

const PaymentConfirmation = () => {
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    // Simulate payment verification process
    setTimeout(() => {
      // Redirect to home page after payment confirmation
      setMessage('Payment confirmed! Redirecting to home page...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000); // Redirect after 2 seconds
    }, 3000); // Simulate payment verification delay (3 seconds)
  }, []); // Run effect only once after component mounts

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default PaymentConfirmation;
