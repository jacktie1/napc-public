import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerHelpInfo from '../components/VolunteerHelpInfo';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { UserContext } from '../auth/UserSession';

import * as magicDataGridUtils from '../utils/magicDataGridUtils';




const StudentAirportPickupAssignmentPage = () => {
  const { userId } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const [airportPickupAssignment, setAirportPickupAssignment] = useState(false);

  useEffect(() => {
    const fetchAirportPickupAssignment = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getAirportPickupAssignment/${userId}`);

        let fetchedAirportPickupAssignment = axiosResponse.data.result.student.airportPickupAssignment;
        let assignedVolunteer = fetchedAirportPickupAssignment?.volunteer;

        if(assignedVolunteer !== undefined && assignedVolunteer !== null) {
          let formattedAirportPickupAssignment = {
            volunteerUserId: fetchedAirportPickupAssignment.volunteerUserId,
            lastName: assignedVolunteer.volunteerProfile.lastName,
            firstName: assignedVolunteer.volunteerProfile.firstName,
            wechatId: assignedVolunteer.volunteerProfile.wechatId,
            gender: magicDataGridUtils.toGenderValue(assignedVolunteer.volunteerProfile.gender),
            emailAddress: assignedVolunteer.volunteerProfile.emailAddress,
            primaryPhoneNumber: assignedVolunteer.volunteerProfile.primaryPhoneNumber,
            homeAddress: assignedVolunteer.volunteerTempHousing.homeAddress,
          }

          setAirportPickupAssignment(formattedAirportPickupAssignment);
        }
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        setServerError(errorMessage);
      }
    };

    fetchAirportPickupAssignment();
  }, [userId]);

  return (
    <div>
      <ApathNavbar />
      <Container>
        <Row className="mt-5">
          <EmergencyContactInfo targetGroup={'student'}/>
        </Row>
      </Container>

      <Container className="mt-5">
        <Row className="mt-5 wide-pretty-box-layout">
          <Col className="pretty-box">
            <h2 className="pretty-box-heading">Airport Pickup Assignment</h2>
            <VolunteerHelpInfo />
            {serverError && (
              <Alert variant='danger'>
                {serverError}
              </Alert>
            )}
            {airportPickupAssignment ?
              <Card>
                <Card.Body>
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Volunteer Id:</p></Col>
                    <Col sm="8"><p class="my-1">{airportPickupAssignment.volunteerUserId}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Last Name:</p></Col>
                    <Col sm="8"><p class="my-1">{airportPickupAssignment.lastName}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">First Name:</p></Col>
                    <Col sm="8"><p class="my-1">{airportPickupAssignment.firstName}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Wechat:</p></Col>
                    <Col sm="8"><p class="my-1">{airportPickupAssignment.wechatId}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Gender:</p></Col>
                    <Col sm="8"><p class="my-1">{airportPickupAssignment.gender}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Email Address:</p></Col>
                    <Col sm="8"><p class="my-1">{airportPickupAssignment.emailAddress}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Phone Number:</p></Col>
                    <Col sm="8"><p class="my-1">{airportPickupAssignment.primaryPhoneNumber}</p></Col>
                  </Row>
                </Card.Body>
              </Card>
              : <Alert variant='info'>No volunteer assigned yet.</Alert>
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentAirportPickupAssignmentPage;