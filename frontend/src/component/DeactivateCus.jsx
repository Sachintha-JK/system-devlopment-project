import React from 'react';
import { Button } from 'react-bootstrap';

function DeactivateCustomer({ customerId, handleDeactivate }) {
  const handleDeactivateClick = () => {
    // Perform deactivate operation using API call
    handleDeactivate(customerId);
  };

  return (
    <Button variant="danger" onClick={handleDeactivateClick}>
      Deactivate
    </Button>
  );
}

export default DeactivateCustomer;
