import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import AdminProfileForm from '../components/AdminProfileForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import AdminNavbar from '../components/AdminNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const AdminProfilePage = () => {
  const { userId, setFullName } = useContext(UserContext);

  var adminProfile;

  const adminProfileFormRef = useRef(null);

  const handleClick = () => {
    adminProfileFormRef.current.submitForm().then(() => {
        const adminProfileErrors = adminProfileFormRef.current.errors;
    
        if (Object.keys(adminProfileErrors).length === 0)
        {
          setFullName(adminProfile.firstName + ' ' + adminProfile.lastName);
          alert('success');
        }
    });
  };

  const handleAdminProfileSubmit = (values, { setSubmitting }) => {
    adminProfile = values;
    setSubmitting(false);
  };

  return (
    <div>
      <AdminNavbar />

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
              <AdminProfileForm
                innerRef={adminProfileFormRef}
                onSubmit={handleAdminProfileSubmit}
                userId={userId}
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