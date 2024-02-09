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

  useEffect(() => {
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

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getFlightInfo/${userId}`);
  
        let studentFlightInfo = axiosResponse.data.result.student.studentFlightInfo;
  
        setLoadedData(studentFlightInfo);
      }
      catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }

    fetchOptions();
  }, [userId])

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