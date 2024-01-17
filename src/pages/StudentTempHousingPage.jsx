import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import TempHousingForm from '../components/TempHousingForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import StudentNavbar from '../components/StudentNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const StudentTempHousingPage = () => {
  const { userId } = useContext(UserContext);

  var studentTempHousing;

  const studentTempHousingFormRef = useRef(null);

  const handleClick = () => {
    studentTempHousingFormRef.current.submitForm().then(() => {
        const studentTempHousingErrors = studentTempHousingFormRef.current.errors;
    
        if (Object.keys(studentTempHousingErrors).length === 0)
        {
          alert('success');
        }
    });
  };

  const handleStudentTempHousingSubmit = (values, { setSubmitting }) => {
    studentTempHousing = values;
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
              <h2 className="pretty-box-heading">Temporary Housing</h2> 
              <RequiredFieldInfo />
              <hr/>
              <TempHousingForm
                innerRef={studentTempHousingFormRef}
                onSubmit={handleStudentTempHousingSubmit}
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

export default StudentTempHousingPage;