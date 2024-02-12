import React, { useState, useEffect, useRef } from 'react';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Row, Col, Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import StudentDetailsModal from '../components/StudentDetailsModal';

const ManageStudentsPage = () => {
  const [studentData, setStudentData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
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
          'arrivalDate': new Date('2024/08/18'),
          'arrivalTime': '00:01',
          'flightNumber': 'DL772',
          'numBigLuggages': '4',
          'requiresPickup': 'Yes',
          'requiresTempHousing': 'No',
          'modified': '07/18/2023 07:07:06'
        },
        {
          "id": '1066',
          "lastName": 'Zhiming',
          'firstName': 'Qi',
          'gender': 'M',
          'arrivalDate': new Date('2024/09/12'),
          'arrivalTime': '15:01',
          'flightNumber': 'AA312',
          'numBigLuggages': '2',
          'requiresPickup': 'Yes',
          'requiresTempHousing': 'Yes',
          'modified': '05/18/2023 07:07:06'
        },
        {
          "id": '1078',
          "lastName": 'Zhou',
          'firstName': 'Fang',
          'gender': 'M',
          'arrivalDate': new Date('2024/09/02'),
          'arrivalTime': '12:01',
          'flightNumber': 'UA031',
          'numBigLuggages': '2',
          'requiresPickup': 'Yes',
          'requiresTempHousing': 'Yes',
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
      checkboxSelection: true,
      cellRenderer: StudentDetailsModal,
      cellRendererParams: {
        readOnly: false,
        adminView: true,
      },
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
      headerName: 'Gender',
      field: 'gender',
      genderFilter: true,
    },
    {
      headerName: 'Arr Date',
      field: 'arrivalDate',
      dateFilter: true,
    },
    {
      headerName: 'Arr Time',
      field: 'arrivalTime',
    },
    {
      headerName: 'FN',
      field: 'flightNumber',
      textFilter: true,
    },
    {
      headerName: 'BigLug',
      field: 'numBigLuggages',
    },
    {
      headerName: 'PK Req',
      field: 'requiresPickup',
      booleanFilter: true,
    },
    {
      headerName: 'Hous Req',
      field: 'requiresTempHousing',
      booleanFilter: true,
    },
    {
      headerName: 'Modified',
      field: 'modified',
    },
  ];

  const handleCloseConfirmModal = () => setShowConfirmModal(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);

  const handleRowSelected = (event) => {
    const studentId = event.node.data.id;

    if(event.node.isSelected())
    {
      setSelectedStudents(selectedStudents => [...selectedStudents, studentId]);
    }
    else
    {
      setSelectedStudents(selectedStudents => selectedStudents.filter(
        (student) => student !== studentId
      ));
    }
  };

  const handleDeleteStudents = () => {
    handleCloseConfirmModal();
    setStudentData(studentData => studentData.filter(
      (studentRow) => !(selectedStudents.includes(studentRow.id))
    ));
    setSelectedStudents([]);
    gridRef.current?.api.deselectAll();
  }

  return (
    <div>
      <ApathNavbar />

      <Container className="mt-5" fluid>
        <Row className="mt-5 admin-pretty-box-layout">
          <Col className="pretty-box">
            <h2 className="pretty-box-heading">Manage Students</h2>
            <Alert dismissible variant='info'>
              This page allows admin to edit or delete student users.
            </Alert>
            <Alert dismissible variant='secondary'>
              This table below displays all students. Click the ID to edit a student.
            </Alert>
            <MultipleSortingInfo/>
            <div className='py-3'>
              <Button variant="danger" onClick={handleShowConfirmModal} disabled={selectedStudents.length===0}>
                  Delete Selected Students
              </Button>
            </div>
            <MagicDataGrid
              innerRef={gridRef}
              gridStyle={{height: 800}}
              columnDefs={columns}
              rowData={studentData}
              pagination={true}
              rowSelection={'multiple'}
              onRowSelected={handleRowSelected}
            />
          </Col>
        </Row>
      </Container>

      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
        <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to delete all the selected student users？<br/><br/>
          {selectedStudents.join(',')}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Cancel
        </Button>
        <Button variant="primary" onClick={handleDeleteStudents}>
            Confirm
        </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageStudentsPage;