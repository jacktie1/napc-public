import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import StudentDetailsModal from '../components/StudentDetailsModal';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';

const ManageStudentsPage = () => {
  const [serverError, setServerError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [studentData, setStudentData] = useState([]);
  const [optionReferences, setOptionReferences] = useState({});

  const gridRef = useRef();

  const fetchData = async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getStudents`);
      let fetchedStudents = axiosResponse.data.result.students;

      let formattedStudents = fetchedStudents.map(function(student) {
        let retRow = {
          userId: student.userAccount.userId,
          lastName: student.studentProfile.lastName,
          firstName: student.studentProfile.firstName,
          gender: magicDataGridUtils.toGenderValue(student.studentProfile.gender),
          hasCompanion: magicDataGridUtils.toYesOrNoValue(student.studentProfile.hasCompanion),
          needsAirportPickup: magicDataGridUtils.toYesOrNoValue(student.studentFlightInfo.needsAirportPickup),
          needsTempHousing: magicDataGridUtils.toYesOrNoValue(student.studentTempHousing.needsTempHousing),
          modifiedAt: new Date(student.modifiedAt),
          lastLoginTime: null,
          arrivalDate: null,
          arrivalTime: null,
          arrivalFlightNumber: null,
          numLgLuggages: null,
        }

        if(student.lastLoginTime)
        {
          retRow.lastLoginTime = new Date(student.lastLoginTime);
        }

        if(student.studentFlightInfo.needsAirportPickup && student.studentFlightInfo.hasFlightInfo)
        {
          let arrivalDatetime = student.studentFlightInfo.arrivalDatetime;

          retRow.arrivalDate = magicDataGridUtils.getDate(arrivalDatetime);
          retRow.arrivalTime = magicDataGridUtils.getTime(arrivalDatetime);
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
      },
      textFilter: true,
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      textFilter: true,
      width: 140,
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
      isDate: true,
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
      numberFilter: true,
      width: 100,
    },
    {
      headerName: 'Has Comp.',
      field: 'hasCompanion',
      booleanFilter: true,
      width: 120,
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
    },
    {
      headerName: 'Last Login',
      field: 'lastLoginTime',
      isTimestamp: true,
      sort: 'desc',
    },
  ];

  const handleCloseConfirmModal = () => setShowConfirmModal(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);

  const handleRowSelected = (event) => {
    let studentUserId = event.node.data.userId;

    if(event.node.isSelected())
    {
      setSelectedStudents(selectedStudents => [...selectedStudents, studentUserId]);
    }
    else
    {
      setSelectedStudents(selectedStudents => selectedStudents.filter(
        (student) => student !== studentUserId
      ));
    }
  };

  const sendDeleteStudentsRequest = async () => {
    try {
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
          columnDefs={columns}
          rowData={studentData}
          pagination={true}
          rowSelection={'multiple'}
          onRowSelected={handleRowSelected}
        />
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