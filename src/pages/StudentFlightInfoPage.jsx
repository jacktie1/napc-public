import React, { useRef, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import StudentFlightInfoForm from '../components/StudentFlightInfoForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import StudentNavbar from '../components/StudentNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const StudentFlightInfoPage = () => {
  const { userId } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const [loadedData, setLoadedData] = useState(false);

  const [optionReferences, setOptionReferences] = useState({});
  
  var studentFlightInfo;

  const studentStudentFlightInfoFormRef = useRef(null);

  const fetchOptions = async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
        params: {
          referenceTypes: ['Airline'].join(','),
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
      needsPickup: 'yes',
      hasFlightInfo: 'yes',
      arrivingFlightNum: 'KE035',
      arrivingFlightAirline: 120,
      arrivingFlightAirlineOther: '',
      arrivingFlightDate: '2024-10-01',
      arrivingFlightTime: '16:12',
      leavingFlightNum: 'KK013',
      leavingFlightAirline: '',
      leavingFlightAirlineOther: 'Jupiter',
      leavingFlightDate: '2024-09-30',
      leavingFlightTime: '02:11',
      numLgLuggages: '4',
      numSmLuggages: '2',
    });

    setDataLoaded(true);
  }
  
  useEffect(() => {
    fetchOptions();
  }, [])

  const handleClick = () => {
    studentStudentFlightInfoFormRef.current.submitForm().then(() => {
        const studentFlightInfoErrors = studentStudentFlightInfoFormRef.current.errors;
    
        if (Object.keys(studentFlightInfoErrors).length === 0)
        {
          alert('success');
        }
    });
  };

  const handleStudentFlightInfoSubmit = (values, { setSubmitting }) => {
    studentFlightInfo = values;
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
              <h2 className="pretty-box-heading">Flight Information</h2> 
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <StudentFlightInfoForm
                innerRef={studentStudentFlightInfoFormRef}
                onSubmit={handleStudentFlightInfoSubmit}
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

export default StudentFlightInfoPage;