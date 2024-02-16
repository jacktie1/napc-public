import React, { useRef, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import StudentTempHousingForm from '../components/StudentTempHousingForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';
import * as formUtils from '../utils/formUtils';


import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const StudentTempHousingPage = () => {
  const { userId } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const [loadedData, setLoadedData] = useState({});

  const [optionReferences, setOptionReferences] = useState({});

  var studentTempHousing;

  const studentTempHousingFormRef = useRef(null);

  useEffect(() => {
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
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };
  
    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getTempHousing/${userId}`);
  
        let studentTempHousing = axiosResponse.data.result.student.studentTempHousing;
  
        setLoadedData(studentTempHousing);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }

    fetchOptions();
  }, [userId])

  const sendUpdateStudentTempHousingRequest = async () => {
    try {
      let preparedTempHousing = formUtils.fromStudentTempHousingForm(studentTempHousing)

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateTempHousing/${userId}`,
        {
          studentTempHousing: preparedTempHousing
        });

      window.scrollTo(0, 0);

      setServerError('');

      alert('Temporary housing information updated successully!');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }

  const handleClick = () => {
    studentTempHousingFormRef.current.submitForm().then(() => {
      let studentTempHousingErrors = studentTempHousingFormRef.current.errors;
    
        if (Object.keys(studentTempHousingErrors).length === 0)
        {
          sendUpdateStudentTempHousingRequest();
        }
    });
  };

  const handleStudentTempHousingSubmit = (values, { setSubmitting }) => {
    studentTempHousing = values;
    setSubmitting(false);
  };

  return (
    <div>
      <ApathNavbar />

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