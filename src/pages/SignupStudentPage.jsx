import React, { useState, useRef } from 'react';
import AppTitle from '../components/AppTitle';
import StudentProfileForm from '../components/StudentProfileForm';
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

  const studentProfileFormRef = useRef(null);
  const flightInfoFormRef = useRef(null);

  /*
  const handleClick = () => {
    studentProfileFormRef.current.submitForm()
      .then(() => {
      flightInfoFormRef.current.submitForm().then(() => {
        const studentProfileErrors = studentProfileFormRef.current.errors;
        const flightInfoErrors = flightInfoFormRef.current.errors;
    
        if (Object.keys(studentProfileErrors).length == 0 && Object.keys(flightInfoErrors).length == 0)
        {
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
      });
    });
  };
  */

  const handleClick = () => {
    studentProfileFormRef.current.submitForm()
      .then(() => {
        const studentProfileErrors = studentProfileFormRef.current.errors;
        if (Object.keys(studentProfileErrors).length == 0)
        {
          alert('Success!');
          console.log(studentProfile);
          //navigate('/login');
        }
        else if (Object.keys(studentProfileErrors).length > 0)
        {
          setActiveCard("studentProfile");
        }
    });
  };

  const handleStudentProfileSubmit = (values, { setSubmitting }) => {
    studentProfile = values;
    setSubmitting(false);
  };

  const handleflightInfoFormSubmit = (values, { setSubmitting }) => {
    flightInfo = values;
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="tempHousing">
                <Accordion.Header>Temporary Housing</Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
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