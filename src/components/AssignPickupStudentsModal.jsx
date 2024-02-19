import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import { Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from './MagicDataGrid';
import MultipleSortingInfo from './MultipleSortingInfo';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';


const AssignPickupStudentsModal = ({ value, node, valueFormatted, viewAssigned, onClose }) => {
    const [serverError, setServerError] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [airportPickupNeeds, setAirportPickupNeeds] = useState([]);
    const [airportPickupAssignments, setAirportPickupAssignments] = useState([]);
    const [selectedAirportPickupNeeds, setSelectedAirportPickupNeeds] = useState([]);
  

    const gridRef = useRef();

    const fetchAirportPickupPreferences = useCallback(async (studentsWithNeed) => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getAirportPickupPreferences/${node.data.volunteerUserId}`);
        let fetchedAirportPickupReferences = axiosResponse.data.result.airportPickupPreferences;
  
        let airportPreferencesMap = {};
  
        for (let airportPickupPreference of fetchedAirportPickupReferences) {
          airportPreferencesMap[airportPickupPreference.studentUserId] = airportPickupPreference;
        }
  
        for (let studentWithNeed of studentsWithNeed) {
          if (airportPreferencesMap[studentWithNeed.studentUserId]) {
            studentWithNeed.preferredByThisVolunteer = magicDataGridUtils.toYesOrNoValue(true);
          }
        }

        setAirportPickupNeeds(studentsWithNeed);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }, [node.data.volunteerUserId]);

    const formatDataRows = useCallback((dataRows, referencesById, airportAssignmentsMap) => {
      let formattedDataRows = dataRows.map(function(dataRow) {
        let arrivalDatetime = dataRow.studentFlightInfo.arrivalDatetime;

        let retRow = {
          studentUserId: dataRow.userAccount.userId,
          lastName: dataRow.studentProfile.lastName,
          firstName: dataRow.studentProfile.firstName,
          gender: magicDataGridUtils.toGenderValue(dataRow.studentProfile.gender),
          isNewStudent: magicDataGridUtils.toYesOrNoValue(dataRow.studentProfile.isNewStudent),
          major: dataRow.studentProfile.customMajor,
          arrivalAirline: dataRow.studentFlightInfo.customArrivalAirline,
          arrivalDate: magicDataGridUtils.getDate(arrivalDatetime),
          arrivalTime: magicDataGridUtils.getTime(arrivalDatetime),
          arrivalFlightNumber: dataRow.studentFlightInfo.arrivalFlightNumber,
          numLgLuggages: dataRow.studentFlightInfo.numLgLuggages,
          airportPickupVolunteer: dataRow?.airportPickupAssignment?.volunteerUserId,
          preferredByThisVolunteer: magicDataGridUtils.toYesOrNoValue(false),
          modified: new Date(dataRow.modifiedAt),
        }

        if(dataRow.studentProfile.majorReferenceId !== null) {
          retRow.major = referencesById['Major'][dataRow.studentProfile.majorReferenceId];
        }

        if(dataRow.studentFlightInfo.arrivalAirlineReferenceId !== null) {
          retRow.arrivalAirline = referencesById['Airline'][dataRow.studentFlightInfo.arrivalAirlineReferenceId];
        }

        if (airportAssignmentsMap[retRow.studentUserId]) {
          retRow.rowSelected = true;
        }
        
        return retRow
      });

      return formattedDataRows;
    }, []);
      
    const fetchAirportPickupNeeds = useCallback(async (referencesById, airportAssignmentsMap) => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getAirportPickupNeeds`);
        let fetchedAirportPickupNeeds = axiosResponse.data.result.students;

        let formattedAirportPickupNeeds = formatDataRows(fetchedAirportPickupNeeds, referencesById, airportAssignmentsMap);

        fetchAirportPickupPreferences(formattedAirportPickupNeeds);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }, [fetchAirportPickupPreferences, formatDataRows]);

    const fetchAirportPickupAssignments = useCallback(async (referencesById) => {
      try {
        let axiosResponse;
        if(viewAssigned) {
          axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getAirportPickupAssignments/${node.data.volunteerUserId}`, {
            params: {
              includeStudentDetails: true,
            }
          });
        } else {
          axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getAirportPickupAssignments/${node.data.volunteerUserId}`);
        }

        let fetchedAirportPickupAssignments = axiosResponse.data.result.airportPickupAssignments;

        let extractedAirportPickupAssignments = fetchedAirportPickupAssignments.map(function(airportPickupAssignment) {
          return airportPickupAssignment.studentUserId;
        });

        extractedAirportPickupAssignments.sort();

        let airportAssignmentsMap = {};

        for (let airportPickupAssignment of fetchedAirportPickupAssignments) {
          airportAssignmentsMap[airportPickupAssignment.studentUserId] = airportPickupAssignment;
        }

        setAirportPickupAssignments(extractedAirportPickupAssignments);
        setSelectedAirportPickupNeeds(extractedAirportPickupAssignments);

        if(viewAssigned)
        {
          let assignedStudents = fetchedAirportPickupAssignments.map(function(airportPickupAssignment) {
            let assignedStudentDetails = airportPickupAssignment.student;

            // Add the volunteerUserId to the student details
            assignedStudentDetails['airportPickupAssignment'] = {}
            assignedStudentDetails['airportPickupAssignment']['volunteerUserId'] = airportPickupAssignment.volunteerUserId;
            return airportPickupAssignment.student;
          });

          let formattedAssignedStudents = formatDataRows(assignedStudents, referencesById, assignedStudents);

          fetchAirportPickupPreferences(formattedAssignedStudents);
        }
        else
        {
          fetchAirportPickupNeeds(referencesById, airportAssignmentsMap);
        }
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }, [node.data.volunteerUserId, viewAssigned, fetchAirportPickupNeeds, formatDataRows, fetchAirportPickupPreferences]);

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
  
        fetchAirportPickupAssignments(referencesById);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        setServerError(errorMessage);
      }
    }, [fetchAirportPickupAssignments]);

    const sendUpdateAirportPickupAssignmentsRequest = async (submittedAirportPickupNeeds) => {
      try {
        let preparedVolunteerAirportPickupAssignments = submittedAirportPickupNeeds.map(function(studentUserId) {
          return {
            studentUserId: studentUserId,
          }
        });
  
        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateAirportPickupAssignments/${node.data.volunteerUserId}`,
          {
            airportPickupAssignments: preparedVolunteerAirportPickupAssignments,
          });
  
        setServerError('');

        alert('The volunteer airport pickup assignments have been updated successfully!');
  
        // Refresh the data after the update
        fetchOptions();
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };
  
    useEffect(() => {
      if(showModal)
      {
        fetchOptions();
      }
    }, [fetchOptions, showModal]);
  
    const columns = [
      {
        headerName: 'Student Id',
        field: 'studentUserId',
        checkboxSelection: viewAssigned? false : true,
        showDisabledCheckboxes: true,
        textFilter: true,
        width: 120,
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
        textFilter: true,
        width: 120,
      },
      {
        headerName: 'Prefer',
        field: 'preferredByThisVolunteer',
        booleanFilter: true
      },
      {
        headerName: 'Modified',
        field: 'modified',
        isTimestamp: true,
      },
    ];
  
    const handleClose = () => {
      onClose();
      setShowModal(false);
    };

    const handleShow = () => {
      setShowModal(true);
    };

    const handleRowSelected = (event) => {
      let selectedNodes = event.api.getSelectedNodes();
  
      // loop through selected nodes
      // get the studentUserId from each node to create an array of selected students
      let selectedAirportPickupNeeds = [];
  
      selectedNodes.forEach((selectedNode) => {
        selectedAirportPickupNeeds.push(selectedNode.data.studentUserId);
      });
  
      selectedAirportPickupNeeds.sort();
  
      setSelectedAirportPickupNeeds(selectedAirportPickupNeeds);
    };
  
    const handleSubmit = () => {
      let selectedNodes = gridRef.current?.api.getSelectedNodes();
  
      let submittedAirportPickupNeeds = [];
  
      selectedNodes.forEach((selectedNode) => {
        submittedAirportPickupNeeds.push(selectedNode.data.studentUserId);
      });
  
      submittedAirportPickupNeeds.sort();
  
      sendUpdateAirportPickupAssignmentsRequest(submittedAirportPickupNeeds);
    }
  
    
    const isRowSelectable = (params) => {
      if (!params.data.airportPickupVolunteer)
      {
        return true;
      }

      if(params.data.airportPickupVolunteer !== node.data.volunteerUserId)
      {
        return false;
      }

      return true;
    };

    const modalTitle = viewAssigned ?
      'View Pickup Task(s) of ' + node.data.firstName + ' ' + node.data.lastName : 
      'Assign Pickup Task(s) to ' + node.data.firstName + ' ' + node.data.lastName;

    const contentAlert = 'This table below displays all students that ' + ( viewAssigned ? 'are assigned to this volunteer' : 'need pickup.' );

    return (
      <>
        <div onClick={handleShow} className='hyperlink'>
          { valueFormatted ? valueFormatted : value }
        </div>

        <Modal show={showModal} onHide={handleClose} centered fullscreen>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert dismissible variant='info'>
              {contentAlert}
            </Alert>
            { viewAssigned ? null:
              <Alert dismissible variant='secondary'>
                  Click the checkbox will assign the student to this volunteer.<br/><br/>
                  Students already assigned to other volunteers cannot be selected.<br/><br/>
                  For any changes you have made on this page, please click the <b>Submit</b> button at the bottom of the page.
              </Alert>
            }
            <MultipleSortingInfo/>
            {serverError && (
              <Alert variant='danger'>
                {serverError}
              </Alert>
            )}
            <MagicDataGrid
              innerRef={gridRef}
              gridStyle={{height: 720}}
              columnDefs={columns}
              rowData={airportPickupNeeds}
              pagination={true}
              rowSelection={'multiple'}
              isRowSelectable={isRowSelectable}
              onRowSelected={handleRowSelected}
            />
          </Modal.Body>
          <Modal.Footer>
            { viewAssigned ? null :

              <Button variant="primary" onClick={handleSubmit} disabled={magicDataGridUtils.arraysAreIdentical(airportPickupAssignments, selectedAirportPickupNeeds)}>
                  Submit
              </Button>
            }
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

export default AssignPickupStudentsModal;