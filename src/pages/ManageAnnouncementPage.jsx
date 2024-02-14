import React, { useRef, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import AnnouncementForm from '../components/AnnouncementForm';
import { fromYesOrNoOptionValue } from '../utils/formUtils';

import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const AdminProfilePage = () => {
  const [loadedData, setLoadedData] = useState({});

  const [serverError, setServerError] = useState('');

  var announcement;

  const announcementFormRef = useRef(null);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getManagement`);
  
        let management = axiosResponse.data.result.management;
  
        setLoadedData(management);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }
  
    loadExistingData();
  }, [])

  const sendUpdateManagementRequest = async () => {
    try {
      let preparedManagement = {
        doesAssignmentStart: fromYesOrNoOptionValue(announcement.doesAssignmentStart),
        studentRegistrationStartDate: announcement.studentRegistrationStartDate,
        studentRegistrationEndDate: announcement.studentRegistrationEndDate,
        announcement: announcement.announcement,
      };

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/updateManagement`,
        {
          management: preparedManagement,
        });

      setServerError('');

      alert('Management information updated successully!');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };

  const handleClick = () => {
    announcementFormRef.current.submitForm().then(() => {
        const announcementErrors = announcementFormRef.current.errors;
    
        if (Object.keys(announcementErrors).length === 0)
        {
          sendUpdateManagementRequest();
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
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <AnnouncementForm
                innerRef={announcementFormRef}
                onSubmit={handleAnnouncementSubmit}
                loadedData={loadedData}
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