import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import FlightInfoForm from '../components/FlightInfoForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import StudentNavbar from '../components/StudentNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const StudentFlightInfoPage = () => {
  const { userId } = useContext(UserContext);

  var studentFlightInfo;

  const studentFlightInfoFormRef = useRef(null);

  const handleClick = () => {
    studentFlightInfoFormRef.current.submitForm().then(() => {
        const studentFlightInfoErrors = studentFlightInfoFormRef.current.errors;
    
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
              <FlightInfoForm
                innerRef={studentFlightInfoFormRef}
                onSubmit={handleStudentFlightInfoSubmit}
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

export default StudentFlightInfoPage;