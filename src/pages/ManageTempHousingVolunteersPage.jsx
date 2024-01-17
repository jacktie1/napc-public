import React, {useState, useEffect, useRef} from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import AssignHostStudentsModal from '../components/AssignHostStudentsModal';

const ManageTempHousingStudentsPage = () => {
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
          'gender': 'F',
          'emailAddress': 'sming@gmail.com',
          'primaryPhoneNumber': '678-480-3436',
          'homeAddress': '3890 Oak Lane, Marietta, 30062',
          'tempHousingStudents': ['331', '99', '555'],
          'modified': '07/18/2023 07:07:06'
        },
        {
          "id": '1066',
          "lastName": 'Zhiming',
          'firstName': 'Qi',
          'gender': 'M',
          'emailAddress': 'zhimingqi@gmail.com',
          'primaryPhoneNumber': '404-435-5508',
          'homeAddress': '416 Ethel Street NW. Atlanta, Ga 30318',
          'tempHousingStudents': ['5', '222', '9'],
          'modified': '05/18/2023 07:07:06'
        },
        {
          "id": '1078',
          "lastName": 'Zhou',
          'firstName': 'Fang',
          'gender': 'M',
          'emailAddress': 'zhouzhou@gmail.com',
          'primaryPhoneNumber': '404-384-4685',
          'homeAddress': '1461 Sylvan Circle, Brookhaven 30319',
          'tempHousingStudents': ['12', '31'],
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
      cellRenderer: AssignHostStudentsModal,
      textFilter: true,
      width: 100,
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
      headerName: 'Gender',
      field: 'gender',
      genderFilter: true,
      width: 100,
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
      headerName: 'Address',
      field: 'homeAddress',
      textFilter: true,
      minWidth: 300,
    },
    {
      headerName: 'Assigned',
      field: 'tempHousingStudents',
      cellRenderer: AssignHostStudentsModal,
      cellRendererParams: {
        viewAssigned: true,
      },
      isArray: true,
      textFilter: true,
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
              rowData={volunteerData}
              pagination={true}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageTempHousingStudentsPage;