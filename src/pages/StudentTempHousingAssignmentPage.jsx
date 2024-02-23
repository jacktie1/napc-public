import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerHelpInfo from '../components/VolunteerHelpInfo';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { UserContext } from '../auth/UserSession';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';


const StudentTempHousingAssignmentPage = () => {
  const { userId } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const [tempHousingAssignment, setTempHousingAssignment] = useState(false);

  useEffect(() => {
    const fetchTempHousingAssignment = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getTempHousingAssignment/${userId}`);

        let fetchedTempHousingAssignment = axiosResponse.data.result.student.tempHousingAssignment;
        let assignedVolunteer = fetchedTempHousingAssignment?.volunteer;

        if(assignedVolunteer !== undefined && assignedVolunteer !== null) {
          let formattedTempHousingAssignment = {
            volunteerUserId: fetchedTempHousingAssignment.volunteerUserId,
            lastName: assignedVolunteer.volunteerProfile.lastName,
            firstName: assignedVolunteer.volunteerProfile.firstName,
            wechatId: assignedVolunteer.volunteerProfile.wechatId,
            homeAddress: assignedVolunteer.volunteerTempHousing.homeAddress,
            gender: magicDataGridUtils.toGenderValue(assignedVolunteer.volunteerProfile.gender),
            emailAddress: assignedVolunteer.volunteerProfile.emailAddress,
            primaryPhoneNumber: assignedVolunteer.volunteerProfile.primaryPhoneNumber,
          }

          setTempHousingAssignment(formattedTempHousingAssignment);
        }
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        setServerError(errorMessage);
      }
    };

    fetchTempHousingAssignment();
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
            {tempHousingAssignment ?
              <Card>
                <Card.Body>
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Volunteer Id:</p></Col>
                    <Col sm="8"><p class="my-1">{tempHousingAssignment.volunteerUserId}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Last Name:</p></Col>
                    <Col sm="8"><p class="my-1">{tempHousingAssignment.lastName}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">First Name:</p></Col>
                    <Col sm="8"><p class="my-1">{tempHousingAssignment.firstName}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Wechat:</p></Col>
                    <Col sm="8"><p class="my-1">{tempHousingAssignment.wechatId}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Gender:</p></Col>
                    <Col sm="8"><p class="my-1">{tempHousingAssignment.gender}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Home Address:</p></Col>
                    <Col sm="8"><p class="my-1">{tempHousingAssignment.homeAddress}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Email Address:</p></Col>
                    <Col sm="8"><p class="my-1">{tempHousingAssignment.emailAddress}</p></Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4"><p class="my-1 fw-bold">Phone Number:</p></Col>
                    <Col sm="8"><p class="my-1">{tempHousingAssignment.primaryPhoneNumber}</p></Col>
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

export default StudentTempHousingAssignmentPage;