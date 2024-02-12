import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerPickupCapacityForm from '../components/VolunteerPickupCapacityForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const VolunteerPickupCapacityPage = () => {
  const { userId } = useContext(UserContext);

  var volunteerPickupCapacity;

  const volunteerVolunteerPickupCapacityFormRef = useRef(null);

  const handleClick = () => {
    volunteerVolunteerPickupCapacityFormRef.current.submitForm().then(() => {
        const volunteerPickupCapacityErrors = volunteerVolunteerPickupCapacityFormRef.current.errors;
    
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
      <ApathNavbar />

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
              <VolunteerPickupCapacityForm
                innerRef={volunteerVolunteerPickupCapacityFormRef}
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
