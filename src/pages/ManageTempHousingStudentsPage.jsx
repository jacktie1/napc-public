import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import AssignHostedByModal from '../components/AssignHostedByModal';
import VolunteerDetailsModal from '../components/VolunteerDetailsModal';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';

const ManageTempHousingStudentsPage = () => {
  const [serverError, setServerError] = useState('');

  const [tempHousingNeeds, setTempHousingNeeds] = useState([]);

  const gridRef = useRef();
  
  const fetchData = useCallback(async (referencesById) => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getTempHousingNeeds`);
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
          numNights: student.studentTempHousing.numNights,
          tempHousingVolunteer: student?.tempHousingAssignment?.volunteerUserId,
          modified: new Date(student.modifiedAt),
        }

        if(student.studentProfile.majorReferenceId !== null) {
          retRow.major = referencesById['Major'][student.studentProfile.majorReferenceId];
        }

        if(student.studentFlightInfo.arrivalAirlineReferenceId !== null) {
          retRow.arrivalAirline = referencesById['Airline'][student.studentFlightInfo.arrivalAirlineReferenceId];
        }

        return retRow
      });

      setTempHousingNeeds(formattedStudents);
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
      field: 'isNewStudent',
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
      field: 'arrivalAirline',
      textFilter: true,
    },
    {
      headerName: 'Arr Date',
      field: 'arrivalDate',
      dateFilter: true,
      isDate: true,
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
      isTimestamp: true,
      sort: 'desc',
    },
  ];

  return (
    <div>
      <ApathNavbar />

      <Container className="mt-5" fluid>
        <h2 className="pretty-box-heading">Temporary Housing Student List</h2>
        <Alert dismissible variant='info'>
          This table below displays all students that request temporary housing.
        </Alert>
        <Alert dismissible variant='secondary'>
          Click a student ID to assign a housing volunteer to this student.
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
          rowData={tempHousingNeeds}
          pagination={true}
        />
      </Container>
    </div>
  );
};

export default ManageTempHousingStudentsPage;