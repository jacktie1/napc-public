import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import AssignPickupByModal from '../components/AssignPickupByModal';
import VolunteerDetailsModal from '../components/VolunteerDetailsModal';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';

const ManageAirportPickupStudentsPage = () => {
  const [serverError, setServerError] = useState('');

  const [airportPickupNeeds, setAirportPickupNeeds] = useState([]);

  const gridRef = useRef();

  const fetchData = useCallback(async (referencesById) => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getAirportPickupNeeds`);
      let fetchedStudents = axiosResponse.data.result.students;

      let formattedStudents = fetchedStudents.map(function(student) {

        let arrivalDatetime = student.studentFlightInfo.arrivalDatetime;

        let retRow = {
          studentUserId: student.userAccount.userId,
          lastName: student.studentProfile.lastName,
          firstName: student.studentProfile.firstName,
          gender: magicDataGridUtils.toGenderValue(student.studentProfile.gender),
          isNewStudent: magicDataGridUtils.toYesOrNoValue(student.studentProfile.isNewStudent),
          major: student.studentProfile.customMajor,
          arrivalAirline: student.studentFlightInfo.customArrivalAirline,
          arrivalDate: magicDataGridUtils.getDate(arrivalDatetime),
          arrivalTime: magicDataGridUtils.getTime(arrivalDatetime),
          arrivalFlightNumber: student.studentFlightInfo.arrivalFlightNumber,
          numLgLuggages: student.studentFlightInfo.numLgLuggages,
          airportPickupVolunteer: student?.airportPickupAssignment?.volunteerUserId,
          modified: new Date(student.modifiedAt),
          lastLoginTime: null,
        }

        if(student.studentProfile.majorReferenceId !== null) {
          retRow.major = referencesById['Major'][student.studentProfile.majorReferenceId];
        }

        if(student.studentFlightInfo.arrivalAirlineReferenceId !== null) {
          retRow.arrivalAirline = referencesById['Airline'][student.studentFlightInfo.arrivalAirlineReferenceId];
        }

        if(student.lastLoginTime)
        {
          retRow.lastLoginTime = new Date(student.lastLoginTime);
        }

        return retRow
      });

      setAirportPickupNeeds(formattedStudents);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
        params: {
          referenceTypes: ['Major', 'Airline'].join(','),
        }
      });

      let referencesById = {};

      let referencesByType = axiosResponse.data.result.referencesByType;

      for (let referenceType in referencesByType) {
        let referenceList = referencesByType[referenceType];

        let referenceMap = {};

        for (let reference of referenceList) {
          referenceMap[reference.referenceId] = reference.value;
        }

        referencesById[referenceType] = referenceMap;
      }

      fetchData(referencesById);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      setServerError(errorMessage);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const columns = [
    {
      headerName: 'Student Id',
      field: 'studentUserId',
      cellRenderer: AssignPickupByModal,
      textFilter: true,
      width: 100,
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      textFilter: true,
      width: 125,
    },
    {
      headerName: 'First Name',
      field: 'firstName',
      textFilter: true,
      width: 150,
    },
    {
      headerName: 'Gender',
      field: 'gender',
      genderFilter: true,
    },
    {
      headerName: 'First Time',
      field: 'isNewStudent',
      booleanFilter: true,
    },
    {
      headerName: 'Major',
      field: 'major',
      textFilter: true,
    },
    {
      headerName: 'Air',
      field: 'arrivalAirline',
      textFilter: true,
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
      width: 100,
    },
    {
      headerName: 'FN',
      field: 'arrivalFlightNumber',
      textFilter: true,
      width: 120,
    },
    {
      headerName: 'BigLug',
      field: 'numLgLuggages',
      width: 100,
    },
    {
      headerName: 'Assigned To',
      field: 'airportPickupVolunteer',
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
      isTimestamp: true,
    },
    {
      headerName: 'Last Login',
      field: 'lastLoginTime',
      isTimestamp: true,
      sort: 'desc',
    },
  ];

  return (
    <div>
      <ApathNavbar />

      <Container className="mt-5" fluid>
        <h2 className="pretty-box-heading">Airport Pickup Student List</h2>
        <Alert dismissible variant='info'>
          This table below displays all students that request airport pickup.
        </Alert>
        <Alert dismissible variant='secondary'>
          Click a student ID to assign a pickup volunteer to this student.
        </Alert>
        <MultipleSortingInfo/>
        {serverError && (
          <Alert variant='danger'>
            {serverError}
          </Alert>
        )}
        <MagicDataGrid
          innerRef={gridRef}
          columnDefs={columns}
          rowData={airportPickupNeeds}
          pagination={true}
        />
      </Container>
    </div>
  );
};

export default ManageAirportPickupStudentsPage;