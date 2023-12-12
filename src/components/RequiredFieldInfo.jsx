import React from 'react';
import { Alert } from 'react-bootstrap';

const RequiredFieldInfo = () => {
  return (
    <Alert variant='light'>
      An <span className="text-danger">*</span> indicates a required field.
    </Alert>
  );
};

export default RequiredFieldInfo;