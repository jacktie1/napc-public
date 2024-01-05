import React, { useState, useRef } from 'react';
import AppTitle from '../components/AppTitle';
import StudentProfileForm from '../components/StudentProfileForm';
import FlightInfoForm from '../components/FlightInfoForm';
import TempHousingForm from '../components/TempHousingForm';
import StudentCommentForm from '../components/StudentCommentForm';
import PrivacyStatement from '../components/PrivacyStatement';
import PatienceInfo from '../components/PatienceInfo';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import { useNavigate } from 'react-router-dom';

import { Container, Button, Row, Col, Accordion } from 'react-bootstrap';

const SignupStudentPage = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState('studentProfile');
  var studentProfile;
  var flightInfo;
  var tempHousing;
  var studentComment;

  const studentProfileFormRef = useRef(null);
  const flightInfoFormRef = useRef(null);
  const tempHousingFormRef = useRef(null);
  const studentCommentFormRef = useRef(null);

  const handleClick = () => {
    studentProfileFormRef.current.submitForm()
      .then(() => {
        flightInfoFormRef.current.submitForm()
        .then(() => {
          tempHousingFormRef.current.submitForm()
          .then(() => {
            studentCommentFormRef.current.submitForm()
            .then(() => {
              const studentProfileErrors = studentProfileFormRef.current.errors;
              const flightInfoErrors = flightInfoFormRef.current.errors;
              const tempHousingErrors = tempHousingFormRef.current.errors;
              const studentCommentErrors = studentCommentFormRef.current.errors;
          
              if (Object.keys(studentProfileErrors).length == 0
                && Object.keys(flightInfoErrors).length == 0
                && Object.keys(tempHousingErrors).length == 0
                && Object.keys(studentCommentErrors).length == 0)
              {
                alert('success');

                navigate('/login');
              }
              else if (Object.keys(studentProfileErrors).length > 0)
              {
                setActiveCard("studentProfile");
              }
              else if (Object.keys(flightInfoErrors).length > 0)
              {
                setActiveCard("flightInfo");
              }
              else if (Object.keys(tempHousingErrors).length > 0)
              {
                setActiveCard("tempHousing");
              }
              else if (Object.keys(studentCommentErrors).length > 0)
              {
                setActiveCard("studentComment");
              }
          });
        });
      });
    });
  };

  const handleStudentProfileSubmit = (values, { setSubmitting }) => {
    studentProfile = values;
    setSubmitting(false);
  };

  const handleFlightInfoFormSubmit = (values, { setSubmitting }) => {
    flightInfo = values;
    setSubmitting(false);
  };

  const handleTempHousingFormSubmit = (values, { setSubmitting }) => {
    tempHousing = values;
    setSubmitting(false);
  };

  const handleStudentCommentFormSubmit = (values, { setSubmitting }) => {
    studentComment = values;
    setSubmitting(false);
  };

  const selectAccordionItem = (eventKey) => {
    setActiveCard(eventKey);
  }

  return (
    <Container>
      <AppTitle />
      <Row className="mt-5 signup-form-box">
        <Col className="auth-form" >
            <h2 className="auth-form-heading">Student Registration</h2> 
            <PrivacyStatement />
            <PatienceInfo />
            <RequiredFieldInfo />
            <hr/>
            <Accordion defaultActiveKey="studentProfile" activeKey={activeCard} onSelect={selectAccordionItem}>
              <Accordion.Item eventKey="studentProfile">
                <Accordion.Header>Basic Information</Accordion.Header>
                <Accordion.Body>
                  <StudentProfileForm
                    innerRef={studentProfileFormRef}
                    onSubmit={handleStudentProfileSubmit}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="flightInfo">
                <Accordion.Header>Flight Information</Accordion.Header>
                <Accordion.Body>
                  <FlightInfoForm
                    innerRef={flightInfoFormRef}
                    onSubmit={handleFlightInfoFormSubmit}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="tempHousing">
                <Accordion.Header>Temporary Housing</Accordion.Header>
                <Accordion.Body>
                  <TempHousingForm
                      innerRef={tempHousingFormRef}
                      onSubmit={handleTempHousingFormSubmit}
                    />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="studentComment">
                <Accordion.Header>Comment</Accordion.Header>
                <Accordion.Body>
                  <StudentCommentForm
                      innerRef={studentCommentFormRef}
                      onSubmit={handleStudentCommentFormSubmit}
                    />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <hr/>
            <Button variant="primary" onClick={handleClick} className="auth-form-button">
              Submit
            </Button> 
            <Button variant="secondary" href='/login' className="auth-form-button">
              Back To Login
            </Button> 
        </Col>
      </Row>
    </Container>
  );
};

export default SignupStudentPage;