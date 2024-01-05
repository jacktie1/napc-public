import React from 'react';
import { Alert } from 'react-bootstrap';

const PatienceInfo = ({ targetGroup }) => {
  if(targetGroup === 'volunteer')
  {
    return (
      <Alert dismissible variant='info'>
        Thank you very much for volunteering! <br/><br/> Information you provide here is critical to help us arrange the activities. Please be patient and flexible.
      </Alert>
    );
  }
  else if (targetGroup === 'student')
  {
    return (
      <Alert dismissible variant='info'>
          Information you provide here is critical to help us helping you. Please be patient and accurate.
      </Alert>
    );
  }
};

export default PatienceInfo;