import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import StudentProfileForm from '../components/StudentProfileForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import StudentNavbar from '../components/StudentNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const StudentProfilePage = () => {
  const { userId, setFullName } = useContext(UserContext);

  var studentProfile;

  const studentProfileFormRef = useRef(null);

  const handleClick = () => {
    studentProfileFormRef.current.submitForm().then(() => {
        const studentProfileErrors = studentProfileFormRef.current.errors;
    
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
              <StudentProfileForm
                innerRef={studentProfileFormRef}
                onSubmit={handleStudentProfileSubmit}
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

export default StudentProfilePage;