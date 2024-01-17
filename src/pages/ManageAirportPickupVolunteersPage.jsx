import React, {useState, useEffect, useRef} from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import AssignPickupStudentsModal from '../components/AssignPickupStudentsModal';

const ManageAirportPickupVolunteersPage = () => {
  const [volunteerData, setVolunteerData] = useState([]);

  const gridRef = useRef();

  useEffect(() => {
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchData = () => {
      setVolunteerData([
        {
          "id": '1024',
          "lastName": 'Zhao',
          'firstName': 'Siming',
          'sex': 'F',
          'arrivalDate': new Date('2024/08/18'),
          'emailAddress': 'sming@gmail.com',
          'primaryPhoneNumber': '119-222-5555',
          'airportPickupStudents': ['331', '99', '555'],
          'modified': '07/18/2023 07:07:06'
        },
        {
          "id": '1066',
          "lastName": 'Zhiming',
          'firstName': 'Qi',
          'sex': 'M',
          'emailAddress': 'zhmingqq@gmail.com',
          'primaryPhoneNumber': '666-666-6666',
          'airportPickupStudents': ['5', '222', '9'],
          'modified': '05/18/2023 07:07:06'
        },
        {
          "id": '1078',
          "lastName": 'Zhou',
          'firstName': 'Fang',
          'sex': 'M',
          'emailAddress': 'zhouzhou@gmail.com',
          'primaryPhoneNumber': '999-999-9999',
          'airportPickupStudents': ['12', '31'],
          'modified': '01/18/2023 07:07:06'
        },
      ])
    };

    fetchData();
  }, []);

  const columns = [
    {
      headerName: 'Volunteer Id',
      field: 'id',
      cellRenderer: AssignPickupStudentsModal,
      textFilter: true,
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      textFilter: true,
    },
    {
      headerName: 'First Name',
      field: 'firstName',
      textFilter: true,
    },
    {
      headerName: 'Sex',
      field: 'sex',
      sexFilter: true,
    },
    {
      headerName: 'Email',
      field: 'emailAddress',
      textFilter: true,
    },
    {
      headerName: 'Phone No',
      field: 'primaryPhoneNumber',
      textFilter: true,
    },
    {
      headerName: 'Assigned Students',
      field: 'airportPickupStudents',
      cellRenderer: AssignPickupStudentsModal,
      cellRendererParams: {
        viewAssigned: true
      },
      textFilter: true,
      isArray: true,
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
            <h2 className="pretty-box-heading">Manage Volunteer Pickup</h2>
            <Alert dismissible variant='info'>
              This table below displays all volunteers that provided pickup.
            </Alert>
            <Alert dismissible variant='secondary'>
              Click a volunteer ID to assign pickup tasks this volunteer.
            </Alert>
            <MultipleSortingInfo/>
            <MagicDataGrid
              innerRef={gridRef}
              gridStyle={{height: 800}}
              columnDefs={columns}
              rowData={volunteerData}
              pagination={true}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageAirportPickupVolunteersPage;