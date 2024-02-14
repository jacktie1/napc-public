import React, { useRef, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerProfileForm from '../components/VolunteerProfileForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';
import { fromGenderOptionValue, fromOptionalTextValue } from '../utils/formUtils';

import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const VolunteerProfilePage = () => {
  const { userId, updateSession } = useContext(UserContext);

  const [loadedData, setLoadedData] = useState({});

  const [serverError, setServerError] = useState('');

  var volunteerProfile;

  const volunteerProfileFormRef = useRef(null);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getProfile/${userId}`);
  
        let volunteerProfile = axiosResponse.data.result.volunteer.volunteerProfile;
  
        setLoadedData(volunteerProfile);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }
  
    loadExistingData();
  }, [userId])

  const sendUpdateVolunteerProfileRequest = async () => {
    try {
      let preparedVolunteerProfile = {
        firstName: volunteerProfile.firstName,
        lastName: volunteerProfile.lastName,
        gender: fromGenderOptionValue(volunteerProfile.gender),
        affiliation: volunteerProfile.affiliation,
        emailAddress: volunteerProfile.emailAddress,
        wechatId: fromOptionalTextValue(volunteerProfile.wechatId),
        primaryPhoneNumber: volunteerProfile.primaryPhoneNumber,
        secondaryPhoneNumber: fromOptionalTextValue(volunteerProfile.secondaryPhoneNumber),
      };

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateProfile/${userId}`,
        {
          volunteerProfile: preparedVolunteerProfile,
        });

      setServerError('');

      updateSession({firstName: volunteerProfile.firstName, lastName: volunteerProfile.lastName});

      alert('Profile updated successully!');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };


  const handleClick = () => {
    volunteerProfileFormRef.current.submitForm().then(() => {
        const volunteerProfileErrors = volunteerProfileFormRef.current.errors;
    
        if (Object.keys(volunteerProfileErrors).length === 0)
        {
          sendUpdateVolunteerProfileRequest();
        }
    });
  };

  const handleVolunteerProfileSubmit = (values, { setSubmitting }) => {
    volunteerProfile = values;
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
              <h2 className="pretty-box-heading">Edit Profile</h2> 
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <VolunteerProfileForm
                innerRef={volunteerProfileFormRef}
                onSubmit={handleVolunteerProfileSubmit}
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

export default VolunteerProfilePage;