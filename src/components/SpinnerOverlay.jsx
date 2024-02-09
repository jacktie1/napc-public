import React from 'react';
import { Spinner } from 'react-bootstrap';


const SpinnerOverlay = () => {
  let intialStyle = {display: 'none'};

  return (
    <div className="spinner-overlay">
      <Spinner id="loading-indicator" style={intialStyle} animation="border"/>
    </div>
  );
};

export default SpinnerOverlay;