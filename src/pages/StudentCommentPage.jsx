import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import StudentCommentForm from '../components/StudentCommentForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import StudentNavbar from '../components/StudentNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const StudentCommentPage = () => {
  const { userId } = useContext(UserContext);

  var studentComment;

  const studentCommentFormRef = useRef(null);

  const handleClick = () => {
    studentCommentFormRef.current.submitForm().then(() => {
        const studentCommentErrors = studentCommentFormRef.current.errors;
    
        if (Object.keys(studentCommentErrors).length === 0)
        {
          alert('success');
        }
    });
  };

  const handleStudentCommentSubmit = (values, { setSubmitting }) => {
    studentComment = values;
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
              <h2 className="pretty-box-heading">Comment</h2> 
              <RequiredFieldInfo />
              <hr/>
              <StudentCommentForm
                innerRef={studentCommentFormRef}
                onSubmit={handleStudentCommentSubmit}
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

export default StudentCommentPage;