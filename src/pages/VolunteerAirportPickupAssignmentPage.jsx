import React, {useState, useEffect} from 'react';
import ApathNavbar from '../components/ApathNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import StudentDetailsModal from '../components/StudentDetailsModal';




const VolunteerAirportPickupAssignmentPage = () => {
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
        'wechat': 'qqad1323',
        'gender': 'F',
        'major': 'ECE',
        'airlineName': 'Delta',
        'flightNumber': 'DL2053',
        'arrivalDate': '2024-08-03',
        'arrivalTime': '15:55',
      }])
    };

    fetchData();
  }, []);

  const columns = [
    {
      headerName: 'Student Id',
      field: 'id',
      cellRenderer: StudentDetailsModal,
      cellRendererParams: {
        readOnly: true,
     }
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
      headerName: 'WeChat',
      field: 'wechat',
    },
    {
      headerName: 'Gender',
      field: 'gender',
    },
    {
      headerName: 'Major',
      field: 'major',
    },
    {
      headerName: 'Airline',
      field: 'airlineName',
    },
    {
      headerName: 'Flight',
      field: 'flightNumber',
    },
    {
      headerName: 'Arrival Date',
      field: 'arrivalDate',
      sort: 'asc',
      sortIndex: 0,
    },
    {
      headerName: 'Arrival Time',
      field: 'arrivalTime',
      sort: 'asc',
      sortIndex: 1,
    },

  ];

  return (
    <div>
      <ApathNavbar />
      <Container>
        <Row className="mt-5">
          <EmergencyContactInfo targetGroup={'volunteer'}/>
        </Row>
      </Container>

      <Container className="mt-5">
        <Row className="mt-5 sup-wide-pretty-box-layout">
          <Col className="pretty-box">
            <h2 className="pretty-box-heading">Airport Pickup Assignment</h2>
            <Alert dismissible variant='secondary'>
              This is the pick up list the administrator has assigned to you based on your availability.<br/><br/>
              Please click the student ID to see the detailed information
            </Alert>
            <MultipleSortingInfo/>
            <MagicDataGrid gridStyle={{height: 200}} columnDefs={columns} rowData={airportPickupAssignment} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VolunteerAirportPickupAssignmentPage;