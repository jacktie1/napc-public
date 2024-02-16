import React, { useRef, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerHousingCapacityForm from '../components/VolunteerHousingCapacityForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';
import * as formUtils from '../utils/formUtils';

import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const VolunteerHousingCapacityPage = () => {
  const { userId } = useContext(UserContext);

  const [loadedData, setLoadedData] = useState({});

  const [serverError, setServerError] = useState('');

  var volunteerHousingCapacity;

  const volunteerVolunteerHousingCapacityFormRef = useRef(null);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getTempHousing/${userId}`);
  
        let volunteerTempHousing = axiosResponse.data.result.volunteer.volunteerTempHousing;
  
        setLoadedData(volunteerTempHousing);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }
  
    loadExistingData();
  }, [userId])

  const sendUpdateVolunteerTempHousingRequest = async () => {
    try {
      let preparedVolunteerTempHousing = formUtils.fromVolunteerTempHousingForm(volunteerHousingCapacity);

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateTempHousing/${userId}`,
        {
          volunteerTempHousing: preparedVolunteerTempHousing,
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
    volunteerVolunteerHousingCapacityFormRef.current.submitForm().then(() => {
        const volunteerHousingCapacityErrors = volunteerVolunteerHousingCapacityFormRef.current.errors;
    
        if (Object.keys(volunteerHousingCapacityErrors).length === 0)
        {
          sendUpdateVolunteerTempHousingRequest();
        }
    });
  };

  const handleVolunteerHousingCapacitySubmit = (values, { setSubmitting }) => {
    volunteerHousingCapacity = values;
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
              <h2 className="pretty-box-heading">Temporary Housing</h2> 
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <VolunteerHousingCapacityForm
                innerRef={volunteerVolunteerHousingCapacityFormRef}
                onSubmit={handleVolunteerHousingCapacitySubmit}
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

export default VolunteerHousingCapacityPage;
