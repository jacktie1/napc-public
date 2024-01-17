import React, { useState, useRef } from 'react';
import AppTitle from '../components/AppTitle';
import VolunteerProfileForm from '../components/VolunteerProfileForm';
import PickupCapacityForm from '../components/PickupCapacityForm';
import HousingCapacityForm from '../components/HousingCapacityForm';
import PrivacyStatement from '../components/PrivacyStatement';
import PatienceInfo from '../components/PatienceInfo';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import { useNavigate } from 'react-router-dom';

import { Container, Button, Row, Col, Accordion } from 'react-bootstrap';

const SignupVolunteerPage = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState('volunteerProfile');
  var volunteerProfile;
  var pickupCapacity;
  var housingCapacity;

  const volunteerProfileFormRef = useRef(null);
  const pickupCapacityFormRef = useRef(null);
  const housingCapacityFormRef = useRef(null);

  const handleClick = () => {
    volunteerProfileFormRef.current.submitForm()
      .then(() => {
        pickupCapacityFormRef.current.submitForm()
        .then(() => {
          housingCapacityFormRef.current.submitForm()
          .then(() => {
            const volunteerProfileErrors = volunteerProfileFormRef.current.errors;
            const pickupCapacityErrors = pickupCapacityFormRef.current.errors;
            const housingCapacityErrors = housingCapacityFormRef.current.errors;
        
            if (Object.keys(volunteerProfileErrors).length == 0
              && Object.keys(pickupCapacityErrors).length == 0
              && Object.keys(housingCapacityErrors).length == 0)
            {
              alert('success');

              navigate('/login');
            }
            else if (Object.keys(volunteerProfileErrors).length > 0)
            {
              setActiveCard("volunteerProfile");
            }
            else if (Object.keys(pickupCapacityErrors).length > 0)
            {
              setActiveCard("pickupCapacity");
            }
            else if (Object.keys(housingCapacityErrors).length > 0)
            {
              setActiveCard("housingCapacity");
            }
        });
      });
    });
  };

  const handleVolunteerProfileSubmit = (values, { setSubmitting }) => {
    volunteerProfile = values;
    setSubmitting(false);
  };

  const handlePickupCapacityFormSubmit = (values, { setSubmitting }) => {
    pickupCapacity = values;
    setSubmitting(false);
  };

  const handleHousingCapacityFormSubmit = (values, { setSubmitting }) => {
    housingCapacity = values;
    setSubmitting(false);
  };

  const selectAccordionItem = (eventKey) => {
    setActiveCard(eventKey);
  }

  return (
    <Container className="mt-5">
      <AppTitle />
      <Row className="mt-5 wide-pretty-box-layout">
        <Col className="pretty-box" >
            <h2 className="pretty-box-heading">Volunteer Registration</h2> 
            <PrivacyStatement />
            <PatienceInfo targetGroup="volunteer"/>
            <RequiredFieldInfo />
            <hr/>
            <Accordion defaultActiveKey="volunteerProfile" activeKey={activeCard} onSelect={selectAccordionItem}>
              <Accordion.Item eventKey="volunteerProfile">
                <Accordion.Header>Basic Information</Accordion.Header>
                <Accordion.Body>
                  <VolunteerProfileForm
                    innerRef={volunteerProfileFormRef}
                    onSubmit={handleVolunteerProfileSubmit}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="pickupCapacity">
                <Accordion.Header>Airport Pickup Volunteer</Accordion.Header>
                <Accordion.Body>
                  <PickupCapacityForm
                    innerRef={pickupCapacityFormRef}
                    onSubmit={handlePickupCapacityFormSubmit}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="housingCapacity">
                <Accordion.Header>Temporary Housing Volunteer</Accordion.Header>
                <Accordion.Body>
                  <HousingCapacityForm
                      innerRef={housingCapacityFormRef}
                      onSubmit={handleHousingCapacityFormSubmit}
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
};

export default SignupVolunteerPage;