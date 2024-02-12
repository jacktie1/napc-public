import React, {useState, useEffect, useRef} from 'react';
import ApathNavbar from '../components/ApathNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerHelpInfo from '../components/VolunteerHelpInfo';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';

const StudentTempHousingAssignmentPage = () => {
  const [tempHousingAssignment, setTempHousingAssignment] = useState([]);

  useEffect(() => {
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchData = () => {
      setTempHousingAssignment([{
        "id": '1024',
        "lastName": 'Zhao',
        'firstName': 'Siming',
        'gender': 'F',
        'emailAddress': 'fake_email@gmail.com',
        'phoneNumber': '123554-3321',
        'homeAddress': '832 Atlanta St NW, Atlanta, GA, 30332',
      }])
    };

    fetchData();
  }, []);


  const columns = [
    {
      headerName: 'Volunteer Id',
      field: 'id',
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
    },
    {
      headerName: 'First Name',
      field: 'firstName',
    },
    {
      headerName: 'Gender',
      field: 'gender',
    },
    {
      headerName: 'Email Address',
      field: 'emailAddress',
      width: 250,
    },
    {
      headerName: 'Phone No',
      field: 'phoneNumber',
    },
    {
      headerName: 'Home Address',
      field: 'homeAddress',
      width: 300,
    },
  ];

  return (
    <div>
      <ApathNavbar />
      <Container>
        <Row className="mt-5">
          <EmergencyContactInfo targetGroup={'student'}/>
        </Row>
      </Container>

      <Container>
        <Row className="mt-5 sup-wide-pretty-box-layout">
          <Col className="pretty-box">
              <h2 className="pretty-box-heading">Temporary Housing Assignment</h2>
              <VolunteerHelpInfo />
              <MagicDataGrid gridStyle={{height: 200}} columnDefs={columns} rowData={tempHousingAssignment} />
            </Col>
          </Row>
      </Container>
    </div>
  );
};

export default StudentTempHousingAssignmentPage;