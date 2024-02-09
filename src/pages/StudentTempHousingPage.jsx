import React, { useRef, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import StudentTempHousingForm from '../components/StudentTempHousingForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import StudentNavbar from '../components/StudentNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const StudentTempHousingPage = () => {
  const { userId } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const [loadedData, setLoadedData] = useState({});

  const [optionReferences, setOptionReferences] = useState({});

  var studentTempHousing;

  const studentTempHousingFormRef = useRef(null);

  const fetchOptions = async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
        params: {
          referenceTypes: ['Area', 'Location', 'Apartment'].join(','),
        }
      });

      setOptionReferences(axiosResponse.data.result.referencesByType);

      loadExistingData();
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      setServerError(errorMessage);
    }
  };

  const loadExistingData = async () => {
    setLoadedData({
      needsTempHousing: 'yes',
      numNights: '4',
      locationOther: '',
      contactName: '',
      contactEmailAddress: '',
      contactPhoneNumber: '',
      apartment: 88,
      customDestinationAddress: '',
    });
  }
  
  useEffect(() => {
    fetchOptions();
  }, [])

  const handleClick = () => {
    studentTempHousingFormRef.current.submitForm().then(() => {
      let studentTempHousingErrors = studentTempHousingFormRef.current.errors;
    
        if (Object.keys(studentTempHousingErrors).length === 0)
        {
          alert('success');
        }
    });
  };

  const handleStudentTempHousingSubmit = (values, { setSubmitting }) => {
    studentTempHousing = values;
    setSubmitting(false);
  };

  return (
    <div>
      <StudentNavbar />

      <Container>
          <Row className="mt-5">
            <EmergencyContactInfo targetGroup={'student'}/>
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
              <StudentTempHousingForm
                innerRef={studentTempHousingFormRef}
                onSubmit={handleStudentTempHousingSubmit}
                optionReferences={optionReferences}
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

export default StudentTempHousingPage;