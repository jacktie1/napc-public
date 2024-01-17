import React, { useState, useRef, useEffect } from 'react';
import AppTitle from '../components/AppTitle';
import StudentProfileForm from '../components/StudentProfileForm';
import FlightInfoForm from '../components/FlightInfoForm';
import TempHousingForm from '../components/TempHousingForm';
import StudentCommentForm from '../components/StudentCommentForm';
import PrivacyStatement from '../components/PrivacyStatement';
import PatienceInfo from '../components/PatienceInfo';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import { useNavigate } from 'react-router-dom';

import { Container, Button, Row, Col, Accordion, Alert } from 'react-bootstrap';

const SignupStudentPage = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState('studentProfile');
  const [studentRegisterStartDate, setStudentRegisterStartDate] = useState('');
  const [studentRegisterEndDate, setStudentRegisterEndDate] = useState('');

  useEffect(() => {
    setStudentRegisterStartDate('2024/01/01');
    setStudentRegisterEndDate('2024/12/31');
}, [])


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

  const current_datetime = new Date();
  const current_date = new Date(current_datetime.getFullYear() + '/' + (current_datetime.getMonth() + 1) + '/' +  current_datetime.getDate());

  if((current_date >= new Date(studentRegisterStartDate)) && (current_date <= new Date(studentRegisterEndDate)))
  {
    return (
      <Container className="mt-5">
        <AppTitle />
        <Row className="mt-5 wide-pretty-box-layout">
          <Col className="pretty-box" >
              <h2 className="pretty-box-heading">Student Registration</h2> 
              <PrivacyStatement />
              <PatienceInfo targetGroup='student'/>
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
              <Button variant="primary" onClick={handleClick} className="pretty-box-button">
                Submit
              </Button> 
              <Button variant="secondary" href='/login' className="pretty-box-button">
                Back To Login
              </Button> 
          </Col>
        </Row>
      </Container>
    );
  }
  else
  {
    return (
      <Container className="mt-5">
        <AppTitle />
          <Row className="mt-5 nrw-pretty-box-layout">
            <Col className="pretty-box">
            <Alert variant='warning'>
                Student registation is only available between {studentRegisterStartDate} and {studentRegisterEndDate}.<br/><br/>
                If you have any special need, Please contact the system admin at jasonchenatlanta@gmail.com.
            </Alert>
            <Button variant="secondary" href='/login' className="pretty-box-button">
              Back To Login
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default SignupStudentPage;