import React, { useRef, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import AdminProfileForm from '../components/AdminProfileForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';
import { fromGenderOptionValue } from '../utils/formUtils';


import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const AdminProfilePage = () => {
  const { userId, updateSession } = useContext(UserContext);

  const [loadedData, setLoadedData] = useState({});

  const [serverError, setServerError] = useState('');

  var adminProfile;

  const adminProfileFormRef = useRef(null);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getProfile/${userId}`);
  
        let adminProfile = axiosResponse.data.result.admin.adminProfile;
  
        setLoadedData(adminProfile);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }
  
    loadExistingData();
  }, [userId])

  const sendUpdateAdminProfileRequest = async () => {
    try {
      let preparedAdminProfile = {
        firstName: adminProfile.firstName,
        lastName: adminProfile.lastName,
        gender: fromGenderOptionValue(adminProfile.gender),
        affiliation: adminProfile.affiliation,
        emailAddress: adminProfile.emailAddress,
        primaryPhoneNumber: adminProfile.primaryPhoneNumber,
      };

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/updateProfile/${userId}`,
        {
          adminProfile: preparedAdminProfile,
        });

      setServerError('');

      updateSession({firstName: adminProfile.firstName, lastName: adminProfile.lastName});

      alert('Profile updated successully!');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };

  const handleClick = () => {
    adminProfileFormRef.current.submitForm().then(() => {
        const adminProfileErrors = adminProfileFormRef.current.errors;
    
        if (Object.keys(adminProfileErrors).length === 0)
        {
          sendUpdateAdminProfileRequest();
        }
    });
  };

  const handleAdminProfileSubmit = (values, { setSubmitting }) => {
    adminProfile = values;
    setSubmitting(false);
  };

  return (
    <div>
      <ApathNavbar />

      <Container>
          <Row className="mt-5">
            <EmergencyContactInfo targetGroup={'admin'}/>
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
              <AdminProfileForm
                innerRef={adminProfileFormRef}
                onSubmit={handleAdminProfileSubmit}
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

export default AdminProfilePage;