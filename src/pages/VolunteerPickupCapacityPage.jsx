import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import PickupCapacityForm from '../components/PickupCapacityForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import VolunteerNavbar from '../components/VolunteerNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const VolunteerPickupCapacityPage = () => {
  const { userId } = useContext(UserContext);

  var volunteerPickupCapacity;

  const volunteerPickupCapacityFormRef = useRef(null);

  const handleClick = () => {
    volunteerPickupCapacityFormRef.current.submitForm().then(() => {
        const volunteerPickupCapacityErrors = volunteerPickupCapacityFormRef.current.errors;
    
        if (Object.keys(volunteerPickupCapacityErrors).length === 0)
        {
          alert('success');
        }
    });
  };

  const handleVolunteerPickupCapacitySubmit = (values, { setSubmitting }) => {
    volunteerPickupCapacity = values;
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
              <h2 className="pretty-box-heading">Airport Pickup</h2> 
              <RequiredFieldInfo />
              <hr/>
              <PickupCapacityForm
                innerRef={volunteerPickupCapacityFormRef}
                onSubmit={handleVolunteerPickupCapacitySubmit}
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

export default VolunteerPickupCapacityPage;
