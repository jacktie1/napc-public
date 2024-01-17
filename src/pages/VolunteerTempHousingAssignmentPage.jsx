import React, {useState, useEffect} from 'react';
import VolunteerNavbar from '../components/VolunteerNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import StudentDetailsModal from '../components/StudentDetailsModal';


const VolunteerTempHousingAssignmentPage = () => {
  const [tempHousingAssignment, setTempHousingAssignment] = useState([]);

  useEffect(() => {
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchData = () => {
      setTempHousingAssignment([{
        "id": '1011',
        "lastName": 'Jason',
        'firstName': 'Tang',
        'wechat': 'lucyismymom',
        'gender': 'M',
        'major': 'CE',
        'airlineName': 'American Airline',
        'flightNumber': 'AA2051',
        'arrivalDate': '2024-08-03',
        'arrivalTime': '12:55',
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
      <VolunteerNavbar />
      <Container>
        <Row className="mt-5">
          <EmergencyContactInfo targetGroup={'volunteer'}/>
        </Row>
      </Container>

      <Container className="mt-5">
        <Row className="mt-5 sup-wide-pretty-box-layout">
          <Col className="pretty-box">
            <h2 className="pretty-box-heading">Temporary Housing Assignment</h2>
            <Alert dismissible variant='secondary'>
              This page contains the temporary housing that has been assigned to you based on your availability.<br/><br/>
              Please click the student ID to see the detailed information.<br/><br/>
              It is really appreciated if you could provide transportation and breakfast to the students.
            </Alert>
            <MultipleSortingInfo/>
            <MagicDataGrid gridStyle={{height: 200}} columnDefs={columns} rowData={tempHousingAssignment} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VolunteerTempHousingAssignmentPage;