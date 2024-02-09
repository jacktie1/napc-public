import React, { useRef, useContext, useState, useEffect } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import StudentProfileForm from '../components/StudentProfileForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import StudentNavbar from '../components/StudentNavbar';
import { UserContext } from '../auth/UserSession';


const StudentProfilePage = () => {
  const { userId, setFullName } = useContext(UserContext);

  const [loadedData, setLoadedData] = useState({});

  const [serverError, setServerError] = useState('');

  const [optionReferences, setOptionReferences] = useState({});

  var studentProfile;

  const studentProfileFormRef = useRef(null);

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
    setLoadedData({
      firstName: '',
      lastName: '',
      englishName: '',
      gender: '',
      isNewStudent: '',
      graduatesFrom: '',
      studentType: '',
      majorReferenceId: '',
      customMajor: '',
      hasCompanion: '',
      emailAddress: '',
      wechatId: '',
      cnPhoneNumber: '',
      usPhoneNumber: '',
    });
  }

  useEffect(() => {
    fetchOptions();
  }, [])

  const handleClick = () => {
    studentProfileFormRef.current.submitForm().then(() => {
      let studentProfileErrors = studentProfileFormRef.current.errors;
    
        if (Object.keys(studentProfileErrors).length === 0)
        {
          setFullName(studentProfile.firstName + ' ' + studentProfile.lastName);
          alert('success');
        }
    });
  };

  const handleStudentProfileSubmit = (values, { setSubmitting }) => {
    studentProfile = values;
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