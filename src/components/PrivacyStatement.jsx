import React from 'react';
import { Alert } from 'react-bootstrap';

const PrivacyStatement = () => {
  return (
    <Alert dismissible variant='success'>
      All information you provided will be kept confidential.
      We do not share your information with any other agency or third party.
    </Alert>
  );
};

export default PrivacyStatement;