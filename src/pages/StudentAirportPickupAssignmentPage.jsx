import React, {useState, useEffect} from 'react';
import StudentNavbar from '../components/StudentNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import VolunteerHelpInfo from '../components/VolunteerHelpInfo';
import { Container, Row, Col } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';



const StudentAirportPickupAssignmentPage = () => {
  const [airportPickupAssignment, setAirportPickupAssignment] = useState([]);

  useEffect(() => {
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchData = () => {
      setAirportPickupAssignment([{
        "id": '1024',
        "lastName": 'Zhao',
        'firstName': 'Siming',
        'sex': 'F',
        'emailAddress': 'fake_email@gmail.com',
        'phoneNumber': '123554-3321'
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
      headerName: 'Sex',
      field: 'sex',
    },
    {
      headerName: 'Email Address',
      field: 'emailAddress',
      width: 200,
    },
    {
      headerName: 'Phone No',
      field: 'phoneNumber',
    },
  ];

  return (
    <div>
      <StudentNavbar />
      <Container>
        <Row className="mt-5">
          <EmergencyContactInfo targetGroup={'student'}/>
        </Row>
      </Container>

      <Container className="mt-5">
        <Row className="mt-5 sup-wide-pretty-box-layout">
          <Col className="pretty-box">
            <h2 className="pretty-box-heading">Airport Pickup Assignment</h2>
            <VolunteerHelpInfo />
            <MagicDataGrid gridStyle={{height: 200}} columnDefs={columns} rowData={airportPickupAssignment} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentAirportPickupAssignmentPage;