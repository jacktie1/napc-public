import React from 'react';
import { Form } from 'react-bootstrap';

const RequiredFieldFormLabel = ({ children }) => {
  return (
    <Form.Label>{children} <span className="text-danger">*</span></Form.Label>
  );
};

export default RequiredFieldFormLabel;