import React from 'react';
import { Alert } from 'react-bootstrap';

const PatienceInfo = ({ children }) => {
  return (
    <Alert dismissible variant='info'>
        Information you provide here is critical to help us helping you. Please be patient and accurate.
    </Alert>
  );
};

export default PatienceInfo;