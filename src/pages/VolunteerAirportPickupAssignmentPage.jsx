import React, { useState, useEffect, useCallback, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import StudentDetailsModal from '../components/StudentDetailsModal';
import { UserContext } from '../auth/UserSession';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';


const VolunteerAirportPickupAssignmentPage = () => {
  const { userId } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const [airportPickupAssignments, setAirportPickupAssignments] = useState([]);
  const [optionReferences, setOptionReferences] = useState({});

  const formatDataRows = useCallback((dataRows, referencesById) => {
    let formattedDataRows = dataRows.map(function(dataRow) {
      let arrivalDatetime = dataRow.studentFlightInfo.arrivalDatetime;

      let retRow = {
        studentUserId: dataRow.studentUserId,
        lastName: dataRow.studentProfile.lastName,
        firstName: dataRow.studentProfile.firstName,
        wechatId: dataRow.studentProfile.wechatId,
        gender: magicDataGridUtils.toGenderValue(dataRow.studentProfile.gender),
        major: dataRow.studentProfile.customMajor,
        arrivalAirline: dataRow.studentFlightInfo.customArrivalAirline,
        arrivalDate: magicDataGridUtils.getDate(arrivalDatetime),
        arrivalTime: magicDataGridUtils.getTime(arrivalDatetime),
        arrivalFlightNumber: dataRow.studentFlightInfo.arrivalFlightNumber,
        modified: new Date(dataRow.modifiedAt),
      }

      if(dataRow.studentProfile.majorReferenceId !== null) {
        retRow.major = referencesById['Major'][dataRow.studentProfile.majorReferenceId];
      }

      if(dataRow.studentFlightInfo.arrivalAirlineReferenceId !== null) {
        retRow.arrivalAirline = referencesById['Airline'][dataRow.studentFlightInfo.arrivalAirlineReferenceId];
      }
      
      return retRow
    });

    return formattedDataRows;
  }, []);

  const fetchAirportPickupAssignments = useCallback(async (referencesById) => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getAirportPickupAssignments/${userId}`, {
        params: {
          includeStudentDetails: true,
        }
      });

      let fetchedAirportPickupAssignments = axiosResponse.data.result.airportPickupAssignments;

      let assignedStudents = fetchedAirportPickupAssignments.map(function(airportPickupAssignment) {
        let assignedStudentDetails = airportPickupAssignment.student;

        assignedStudentDetails.studentUserId = airportPickupAssignment.studentUserId;
  
        return assignedStudentDetails;
      });

      let formattedAssignedStudents = formatDataRows(assignedStudents, referencesById);

      setAirportPickupAssignments(formattedAssignedStudents);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }, [userId, formatDataRows]);

  const fetchOptions = useCallback(async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
        params: {
          referenceTypes: ['Major', 'Airline', 'Area', 'Location', 'Apartment'].join(','),
        }
      });

      let referencesById = {};

      let referencesByType = axiosResponse.data.result.referencesByType;

      setOptionReferences(referencesByType);

      for (let referenceType in referencesByType) {
        let referenceList = referencesByType[referenceType];

        let referenceMap = {};

        for (let reference of referenceList) {
          referenceMap[reference.referenceId] = reference.value;
        }

        referencesById[referenceType] = referenceMap;
      }

      fetchAirportPickupAssignments(referencesById);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      setServerError(errorMessage);
    }
  }, [fetchAirportPickupAssignments]);


  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const columns = [
    {
      headerName: 'Student Id',
      field: 'studentUserId',
      cellRenderer: StudentDetailsModal,
      cellRendererParams: {
        readOnly: true,
        optionReferences: optionReferences,
        onClose: fetchOptions,
     },
     width: 100,
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
      field: 'wechatId',
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
      field: 'arrivalAirline',
    },
    {
      headerName: 'Flight',
      field: 'arrivalFlightNumber',
    },
    {
      headerName: 'Arrival Date',
      field: 'arrivalDate',
      sort: 'asc',
      isDate: true,
      sortIndex: 0,
    },
    {
      headerName: 'Arrival Time',
      field: 'arrivalTime',
      sort: 'asc',
      isTimestamp: true,
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
            {serverError && (
              <Alert variant='danger'>
                {serverError}
              </Alert>
            )}
            <MagicDataGrid columnDefs={columns} rowData={airportPickupAssignments} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VolunteerAirportPickupAssignmentPage;