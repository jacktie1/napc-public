import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import HousingCapacityForm from '../components/HousingCapacityForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import VolunteerNavbar from '../components/VolunteerNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const VolunteerHousingCapacityPage = () => {
  const { userId } = useContext(UserContext);

  var volunteerHousingCapacity;

  const volunteerHousingCapacityFormRef = useRef(null);

  const handleClick = () => {
    volunteerHousingCapacityFormRef.current.submitForm().then(() => {
        const volunteerHousingCapacityErrors = volunteerHousingCapacityFormRef.current.errors;
    
        if (Object.keys(volunteerHousingCapacityErrors).length === 0)
        {
          alert('success');
        }
    });
  };

  const handleVolunteerHousingCapacitySubmit = (values, { setSubmitting }) => {
    volunteerHousingCapacity = values;
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
              <h2 className="pretty-box-heading">Temporary Housing</h2> 
              <RequiredFieldInfo />
              <hr/>
              <HousingCapacityForm
                innerRef={volunteerHousingCapacityFormRef}
                onSubmit={handleVolunteerHousingCapacitySubmit}
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

export default VolunteerHousingCapacityPage;