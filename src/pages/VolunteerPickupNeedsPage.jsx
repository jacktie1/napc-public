import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import { UserContext } from '../auth/UserSession';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';

const VolunteerPickupNeedsPage = () => {
  const { userId } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const [airportPickupNeeds, setAirportPickupNeeds] = useState([]);

  const [airportPickupPreferences, setAirportPickupPreferences] = useState([]);
  const [selectedAirportPickupNeeds, setSelectedAirportPickupNeeds] = useState([]);

  const gridRef = useRef();

  const fetchAirportPickupPreferences = useCallback(async (studentsWithNeeds) => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getAirportPickupPreferences/${userId}`);
      let fetchedAirportPickupReferences = axiosResponse.data.result.airportPickupPreferences;

      let extractedAirportPickupPreferences = fetchedAirportPickupReferences.map(function(airportPickupPreference) {
        return airportPickupPreference.studentUserId;
      });

      extractedAirportPickupPreferences.sort();

      let airportPreferencesMap = {};

      for (let airportPickupPreference of fetchedAirportPickupReferences) {
        airportPreferencesMap[airportPickupPreference.studentUserId] = airportPickupPreference;
      }

      for (let studentWithNeed of studentsWithNeeds) {
        if (airportPreferencesMap[studentWithNeed.studentUserId]) {
          studentWithNeed.rowSelected = true;
        }
      }

      setAirportPickupNeeds(studentsWithNeeds);
      setAirportPickupPreferences(extractedAirportPickupPreferences);
      setSelectedAirportPickupNeeds(extractedAirportPickupPreferences);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }, [userId]);

  const fetchAirportPickupNeeds = useCallback(async (referencesById) => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getAirportPickupNeeds`);
      let fetchedStudents = axiosResponse.data.result.students;

      let formattedStudents = fetchedStudents.map(function(student) {
        let retRow = {
          studentUserId: student.userAccount.userId,
          return: student.studentProfile.isNewStudent ? 'FirstTime' : 'Return',
          arrivalFlightNumber: student.studentFlightInfo.arrivalFlightNumber,
          arrivalDate: magicDataGridUtils.getDate(student.studentFlightInfo.arrivalDatetime),
          arrivalTime: magicDataGridUtils.getTime(student.studentFlightInfo.arrivalDatetime),
          major: student.studentProfile.customMajor,
          arrivalAirline: student.studentFlightInfo.customArrivalAirline,
        }

        if(student.studentProfile.majorReferenceId !== null) {
          retRow.major = referencesById['Major'][student.studentProfile.majorReferenceId];
        }

        if(student.studentFlightInfo.arrivalAirlineReferenceId !== null) {
          retRow.arrivalAirline = referencesById['Airline'][student.studentFlightInfo.arrivalAirlineReferenceId];
        }

        return retRow
      });

      fetchAirportPickupPreferences(formattedStudents);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }, [fetchAirportPickupPreferences]);

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

      fetchAirportPickupNeeds(referencesById);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      setServerError(errorMessage);
    }
  }, [fetchAirportPickupNeeds]);

  const sendUpdateAirportPickupPreferencesRequest = async (submittedAirportPickupNeeds) => {
    try {
      let preparedVolunteerAirportPickupPreferences = submittedAirportPickupNeeds.map(function(studentUserId) {
        return {
          studentUserId: studentUserId,
        }
      });

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateAirportPickupPreferences/${userId}`,
        {
          airportPickupPreferences: preparedVolunteerAirportPickupPreferences,
        });

      setServerError('');

      // Refresh the data after the update
      fetchOptions();
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const columns = [
    {
      headerName: 'Student Id',
      field: 'studentUserId',
      checkboxSelection: true,
      width: 150,
    },
    {
      headerName: 'Major',
      field: 'major',
      minWidth: 250,
    },
    {
      headerName: 'Return',
      field: 'return',
      width: 100,
    },
    {
      headerName: 'Airline Name',
      field: 'arrivalAirline',
    },
    {
      headerName: '	Flight Number',
      field: 'arrivalFlightNumber',
      width: 170,
    },
    {
      headerName: 'Arrive Date',
      field: 'arrivalDate',
      isDate: true,
      sort: 'asc',
      sortIndex: 0,
    },
    {
      headerName: 'Arrive Time',
      field: 'arrivalTime',
      sort: 'asc',
      sortIndex: 1,
      width: 150,
    },
  ];

  const handleRowSelected = (event) => {
    let selectedNodes = event.api.getSelectedNodes();

    // loop through selected nodes
    // get the studentUserId from each node to create an array of selected students
    let selectedAirportPickupNeeds = [];

    selectedNodes.forEach((node) => {
      selectedAirportPickupNeeds.push(node.data.studentUserId);
    });

    selectedAirportPickupNeeds.sort();

    setSelectedAirportPickupNeeds(selectedAirportPickupNeeds);
  };

  const handleSubmit = () => {
    let selectedNodes = gridRef.current?.api.getSelectedNodes();

    let submittedAirportPickupNeeds = [];

    selectedNodes.forEach((node) => {
      submittedAirportPickupNeeds.push(node.data.studentUserId);
    });

    submittedAirportPickupNeeds.sort();

    sendUpdateAirportPickupPreferencesRequest(submittedAirportPickupNeeds);
  }

  return (
    <div>
      <ApathNavbar />
      <Container>
        <Row className="mt-5">
          <EmergencyContactInfo targetGroup={'volunteer'} />
        </Row>
      </Container>

      <Container className="mt-5">
        <Row className="mt-5 sup-wide-pretty-box-layout">
          <Col className="pretty-box">
            <h2 className="pretty-box-heading">Airport Pickup Needs</h2>
            <Alert dismissible variant='secondary'>
                Please click the <b>checkbox</b> if you are available to pick up and click <b>Submit Changes</b>.<br/><br/>
                Give the preference to <b>first-time</b> student.
                First-time means this is their first time attending this university<br/><br/>
                Note: Checking box only informs the administrator your availability.
                It does not mean you will be required to pick up. The administrator will assign the pick up task based on other information such as the size of your car.
                You will receive a confirmation email if assigned.
            </Alert>
            <MultipleSortingInfo/>
            <hr/>
            {serverError && (
              <Alert variant='danger'>
                {serverError}
              </Alert>
            )}
            <div className='py-3'>
              <Button variant="primary" onClick={handleSubmit} disabled={magicDataGridUtils.arraysAreIdentical(airportPickupPreferences, selectedAirportPickupNeeds)}>
                  Submit Changes
              </Button>
            </div>
            <MagicDataGrid
              innerRef={gridRef}
              columnDefs={columns}
              rowData={airportPickupNeeds}
              pagination={true}
              rowSelection={'multiple'}
              onRowSelected={handleRowSelected}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VolunteerPickupNeedsPage;