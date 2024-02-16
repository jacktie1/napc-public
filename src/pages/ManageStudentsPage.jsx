import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Row, Col, Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import StudentDetailsModal from '../components/StudentDetailsModal';
import * as magicGridUtils from '../utils/magicGridUtils';

const ManageStudentsPage = () => {
  const [serverError, setServerError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [studentData, setStudentData] = useState([]);
  const [optionReferences, setOptionReferences] = useState({});
  const [loadedData, setLoadedData] = useState({});

  const gridRef = useRef();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
          params: {
            referenceTypes: ['Major', 'Airline', 'Area', 'Location', 'Apartment'].join(','),
          }
        });
  
        setOptionReferences(axiosResponse.data.result.referencesByType);

        fetchData();
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        setServerError(errorMessage);
      }
    };
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getStudents`);
        let fetechedStudents = axiosResponse.data.result.students;

        let fetchedStudentsById = fetechedStudents.reduce((acc, student) => {
          acc[student.userAccount.userId] = student;
          return acc;
        }, {});

        setLoadedData(fetchedStudentsById);

        let formattedStudents = fetechedStudents.map(function(student) {
          let retRow = {
            userId: student.userAccount.userId,
            lastName: student.studentProfile.lastName,
            firstName: student.studentProfile.firstName,
            gender: magicGridUtils.toGenderValue(student.studentProfile.gender),
            needsAirportPickup: magicGridUtils.toYesOrNoValue(student.studentFlightInfo.needsAirportPickup),
            needsTempHousing: magicGridUtils.toYesOrNoValue(student.studentTempHousing.needsTempHousing),
            modifiedAt: new Date(student.modifiedAt),
            arrivalDate: null,
            arrivalTime: null,
            arrivalFlightNumber: null,
            numLgLuggages: null,
          }

          if(student.studentFlightInfo.needsAirportPickup && student.studentFlightInfo.hasFlightInfo)
          {
            let arrivalDatetime = student.studentFlightInfo.arrivalDatetime;

            retRow.arrivalDate = magicGridUtils.getDate(arrivalDatetime);
            retRow.arrivalTime = magicGridUtils.getTime(arrivalDatetime);
            retRow.arrivalFlightNumber = student.studentFlightInfo.arrivalFlightNumber;
            retRow.numLgLuggages = student.studentFlightInfo.numLgLuggages;
          }

          return retRow
        });

        setStudentData(formattedStudents);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    fetchOptions();
  }, []);

  const columns = [
    {
      headerName: 'Student Id',
      field: 'userId',
      checkboxSelection: true,
      cellRenderer: StudentDetailsModal,
      cellRendererParams: {
        readOnly: false,
        adminView: true,
        optionReferences: optionReferences,
        loadedData: loadedData,
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
      field: 'arrivalFlightNumber',
      textFilter: true,
    },
    {
      headerName: 'BigLug',
      field: 'numLgLuggages',
    },
    {
      headerName: 'PK Req',
      field: 'needsAirportPickup',
      booleanFilter: true,
    },
    {
      headerName: 'Hous Req',
      field: 'needsTempHousing',
      booleanFilter: true,
    },
    {
      headerName: 'Modified',
      field: 'modifiedAt',
      isTimestamp: true,
      sort: 'desc',
    },
  ];

  const handleCloseConfirmModal = () => setShowConfirmModal(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);

  const handleRowSelected = (event) => {
    let studentId = event.node.data.userId;

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

  const sendDeleteStudentsRequest = async () => {
    try {
      console.log('selectedStudents', selectedStudents);
      await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/deleteUsers`, {
        data: {
         userIds: selectedStudents,
        }
      });

      setStudentData(studentData => studentData.filter(
        (studentRow) => !(selectedStudents.includes(studentRow.userId))
      ));
  
      setSelectedStudents([]);

      gridRef.current?.api.deselectAll();

      alert('Students deleted successfully!');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };

  const handleDeleteStudents = () => {
    handleCloseConfirmModal();
    sendDeleteStudentsRequest();
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
            <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
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