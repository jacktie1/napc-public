import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerHousingCapacityForm from '../components/VolunteerHousingCapacityForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';

import { Container, Button, Row, Col } from 'react-bootstrap';

const VolunteerHousingCapacityPage = () => {
  const { userId } = useContext(UserContext);

  var volunteerHousingCapacity;

  const volunteerVolunteerHousingCapacityFormRef = useRef(null);

  const handleClick = () => {
    volunteerVolunteerHousingCapacityFormRef.current.submitForm().then(() => {
        const volunteerHousingCapacityErrors = volunteerVolunteerHousingCapacityFormRef.current.errors;
    
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
      <ApathNavbar />

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
              <VolunteerHousingCapacityForm
                innerRef={volunteerVolunteerHousingCapacityFormRef}
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
