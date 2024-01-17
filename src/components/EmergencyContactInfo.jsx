import React from 'react';
import { Alert } from 'react-bootstrap';

const EmergencyContactInfo = ({targetGroup}) => {
  if(targetGroup === 'volunteer' || targetGroup === 'admin')
  {
    return (
      <Alert variant='info' style={{textAlign: 'center'}}>
        In case of emergency, please contact Carol Hightower at 404-378-5763 or Neal Hightower at 404-403-4500.<br/>
        For general questions, please email them at jasonchenatlanta@gmail.com .
      </Alert>
    );
  }
  else if (targetGroup === 'student')
  {
    return (
      <Alert variant='info' style={{textAlign: 'center'}}>
        In case of emergency, please contact Jason Chen at 404-578-7250. For general questions, please email him at jasonchenatlanta@gmail.com.
      </Alert>
    );
  }
};

export default EmergencyContactInfo;