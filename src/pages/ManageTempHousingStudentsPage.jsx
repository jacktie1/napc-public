import React, {useState, useEffect, useRef} from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import AssignHostedByModal from '../components/AssignHostedByModal';
import VolunteerDetailsModal from '../components/VolunteerDetailsModal';

const ManageTempHousingStudentsPage = () => {
  const [studentData, setStudentData] = useState([]);

  const gridRef = useRef();

  useEffect(() => {
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchData = () => {
      setStudentData([
        {
          "id": '1024',
          "lastName": 'Zhao',
          'firstName': 'Siming',
          'gender': 'F',
          'isNew': 'Yes',
          'major': 'Biological Science',
          'airlineName': 'Delta',
          'arrivalDate': new Date('2024/08/18'),
          'arrivalTime': '00:01',
          'flightNumber': 'DL772',
          'numNights': '4',
          'tempHousingVolunteer': '331',
          'modified': '07/18/2023 07:07:06'
        },
        {
          "id": '1066',
          "lastName": 'Zhiming',
          'firstName': 'Qi',
          'gender': 'M',
          'isNew': 'Yes',
          'major': 'Medical',
          'airlineName': 'American',
          'arrivalDate': new Date('2024/09/12'),
          'arrivalTime': '15:01',
          'flightNumber': 'AA312',
          'numNights': '2',
          'tempHousingVolunteer': '1171',
          'modified': '05/18/2023 07:07:06'
        },
        {
          "id": '1078',
          "lastName": 'Zhou',
          'firstName': 'Fang',
          'gender': 'M',
          'isNew': 'No',
          'major': 'Machine Learning',
          'airlineName': 'United',
          'arrivalDate': new Date('2024/09/02'),
          'arrivalTime': '12:01',
          'flightNumber': 'UA031',
          'numNights': '2',
          'tempHousingVolunteer': null,
          'modified': '01/18/2023 07:07:06'
        },
      ])
    };

    fetchData();
  }, []);

  const columns = [
    {
      headerName: 'Student Id',
      field: 'id',
      cellRenderer: AssignHostedByModal,
      textFilter: true,
      width: 100,
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      textFilter: true,
      width: 120,
    },
    {
      headerName: 'First Name',
      field: 'firstName',
      textFilter: true,
      width: 120,
    },
    {
      headerName: 'Gender',
      field: 'gender',
      genderFilter: true,
      width: 100,
    },
    {
      headerName: 'First Time',
      field: 'isNew',
      booleanFilter: true,
      width: 100,
    },
    {
      headerName: 'Major',
      field: 'major',
      textFilter: true,
    },
    {
      headerName: 'Air',
      field: 'airlineName',
      textFilter: true,
    },
    {
      headerName: 'Arr Date',
      field: 'arrivalDate',
      dateFilter: true,
    },
    {
      headerName: 'Arr Time',
      field: 'arrivalTime',
      width: 100,
    },
    {
      headerName: 'FN',
      field: 'flightNumber',
      textFilter: true,
    },
    {
      headerName: 'Nights',
      field: 'numNights',
      width: 80,
    },
    {
      headerName: 'Assigned To',
      field: 'tempHousingVolunteer',
      cellRenderer: VolunteerDetailsModal,
      cellRendererParams: {
        readOnly: true,
        adminView: true,
      },
      textFilter: true,
      width: 120,
    },
    {
      headerName: 'Modified',
      field: 'modified',
    },
  ];

  return (
    <div>
      <AdminNavbar />

      <Container className="mt-5" fluid>
        <Row className="mt-5 admin-pretty-box-layout">
          <Col className="pretty-box">
            <h2 className="pretty-box-heading">Manage Student Housing</h2>
            <Alert dismissible variant='info'>
              This table below displays all students that required temporary housing.
            </Alert>
            <Alert dismissible variant='secondary'>
              Click a student ID to assign a housing volunteer to this student.
            </Alert>
            <MultipleSortingInfo/>
            <MagicDataGrid
              innerRef={gridRef}
              gridStyle={{height: 800}}
              columnDefs={columns}
              rowData={studentData}
              pagination={true}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageTempHousingStudentsPage;