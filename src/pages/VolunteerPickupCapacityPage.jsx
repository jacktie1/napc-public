import React, { useRef, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerPickupCapacityForm from '../components/VolunteerPickupCapacityForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';
import * as formUtils from '../utils/formUtils';


import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const VolunteerPickupCapacityPage = () => {
  const { userId } = useContext(UserContext);

  const [loadedData, setLoadedData] = useState({});

  const [serverError, setServerError] = useState('');

  var volunteerPickupCapacity;

  const volunteerVolunteerPickupCapacityFormRef = useRef(null);
  
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getAirportPickup/${userId}`);
  
        let volunteerAirportPickup = axiosResponse.data.result.volunteer.volunteerAirportPickup;
  
        setLoadedData(volunteerAirportPickup);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }
  
    loadExistingData();
  }, [userId])

  const sendUpdateVolunteerAirportPickupRequest = async () => {
    try {
      let preparedVolunteerAirportPickup = formUtils.fromVolunteerAirportPickupForm(volunteerPickupCapacity);

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateAirportPickup/${userId}`,
        {
          volunteerAirportPickup: preparedVolunteerAirportPickup,
        });

      setServerError('');

      alert('Airport pickup information updated successully!');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };


  const handleClick = () => {
    volunteerVolunteerPickupCapacityFormRef.current.submitForm().then(() => {
        const volunteerPickupCapacityErrors = volunteerVolunteerPickupCapacityFormRef.current.errors;
    
        if (Object.keys(volunteerPickupCapacityErrors).length === 0)
        {
          sendUpdateVolunteerAirportPickupRequest();
        }
    });
  };

  const handleVolunteerPickupCapacitySubmit = (values, { setSubmitting }) => {
    volunteerPickupCapacity = values;
    setSubmitting(false);
  };

  return (
    <div>
      <ApathNavbar />

      <Container>
          <Row className="mt-5">
            <EmergencyContactInfo targetGroup={'volunteer'}/>
          </Row>
      </Container>

      <Container>
        <Row className="mt-5 wide-pretty-box-layout">
          <Col className="pretty-box" >
              <h2 className="pretty-box-heading">Airport Pickup</h2> 
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <VolunteerPickupCapacityForm
                innerRef={volunteerVolunteerPickupCapacityFormRef}
                onSubmit={handleVolunteerPickupCapacitySubmit}
                loadedData={loadedData}
              />
              <hr/>
              <Button variant="primary" onClick={handleClick} className="pretty-box-button">
                Submit
              </Button> 
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VolunteerPickupCapacityPage;
