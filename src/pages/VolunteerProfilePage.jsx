import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerProfileForm from '../components/VolunteerProfileForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import VolunteerNavbar from '../components/VolunteerNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const VolunteerProfilePage = () => {
  const { userId, setFullName } = useContext(UserContext);

  var volunteerProfile;

  const volunteerProfileFormRef = useRef(null);

  const handleClick = () => {
    volunteerProfileFormRef.current.submitForm().then(() => {
        const volunteerProfileErrors = volunteerProfileFormRef.current.errors;
    
        if (Object.keys(volunteerProfileErrors).length === 0)
        {
          setFullName(volunteerProfile.firstName + ' ' + volunteerProfile.lastName);
          alert('success');
        }
    });
  };

  const handleVolunteerProfileSubmit = (values, { setSubmitting }) => {
    volunteerProfile = values;
    setSubmitting(false);
  };

  return (
    <div>
      <VolunteerNavbar />

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
              <VolunteerProfileForm
                innerRef={volunteerProfileFormRef}
                onSubmit={handleVolunteerProfileSubmit}
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

export default VolunteerProfilePage;