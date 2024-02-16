import React, { useRef, useContext, useState, useEffect } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import StudentProfileForm from '../components/StudentProfileForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';
import * as formUtils from '../utils/formUtils';


const StudentProfilePage = () => {
  const { userId, updateSession } = useContext(UserContext);

  const [loadedData, setLoadedData] = useState({});

  const [serverError, setServerError] = useState('');

  const [optionReferences, setOptionReferences] = useState({});

  var studentProfile;

  const studentProfileFormRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
          params: {
            referenceTypes: ['Major'].join(','),
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
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getProfile/${userId}`);
  
        let studentProfile = axiosResponse.data.result.student.studentProfile;
  
        setLoadedData(studentProfile);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }
  
    fetchOptions();
  }, [userId])

  const sendUpdateStudentProfileRequest = async () => {
    try {
      let preparedStudentProfile = formUtils.fromStudentProfileForm(studentProfile);

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateProfile/${userId}`,
        {
          studentProfile: preparedStudentProfile,
        });

      setServerError('');

      updateSession({firstName: studentProfile.firstName, lastName: studentProfile.lastName});

      alert('Profile updated successully!');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };

  const handleClick = () => {
    studentProfileFormRef.current.submitForm().then(() => {
      let studentProfileErrors = studentProfileFormRef.current.errors;
    
        if (Object.keys(studentProfileErrors).length === 0)
        {
          sendUpdateStudentProfileRequest();
        }
    });
  };

  const handleStudentProfileSubmit = (values, { setSubmitting }) => {
    studentProfile = values;
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
              <h2 className="pretty-box-heading">Edit Profile</h2> 
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <StudentProfileForm
                innerRef={studentProfileFormRef}
                onSubmit={handleStudentProfileSubmit}
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

export default StudentProfilePage;