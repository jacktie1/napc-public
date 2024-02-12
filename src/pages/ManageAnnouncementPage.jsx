import React, { useRef, useContext } from 'react';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import AnnouncementForm from '../components/AnnouncementForm';

import { Container, Button, Row, Col } from 'react-bootstrap';

const AdminProfilePage = () => {
  var announcement;

  const announcementFormRef = useRef(null);

  const handleClick = () => {
    announcementFormRef.current.submitForm().then(() => {
        const announcementErrors = announcementFormRef.current.errors;
    
        if (Object.keys(announcementErrors).length === 0)
        {
          alert('success');
        }
    });
  };

  const handleAnnouncementSubmit = (values, { setSubmitting }) => {
    announcement = values;
    setSubmitting(false);
  };

  return (
    <div>
      <ApathNavbar />

      <Container>
          <Row className="mt-5">
            <EmergencyContactInfo targetGroup={'admin'}/>
          </Row>
      </Container>

      <Container>
        <Row className="mt-5 wide-pretty-box-layout">
          <Col className="pretty-box" >
              <h2 className="pretty-box-heading">Edit Announcement</h2> 
              <RequiredFieldInfo />
              <hr/>
              <AnnouncementForm
                innerRef={announcementFormRef}
                onSubmit={handleAnnouncementSubmit}
              />
              <hr/>
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

export default AdminProfilePage;