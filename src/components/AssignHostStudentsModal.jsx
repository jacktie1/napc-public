import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import { Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from './MagicDataGrid';
import MultipleSortingInfo from './MultipleSortingInfo';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';


const AssignHostStudentsModal = ({ value, node, valueFormatted, viewAssigned, onClose }) => {
    const [serverError, setServerError] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [tempHousingNeeds, setTempHousingNeeds] = useState([]);
    const [tempHousingAssignments, setTempHousingAssignments] = useState([]);
    const [selectedTempHousingNeeds, setSelectedTempHousingNeeds] = useState([]);
  
    const gridRef = useRef();

    const formatDataRows = useCallback((dataRows, referencesById, tempHousingAssignmentsMap) => {
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
          numNights: dataRow.studentTempHousing.numNights,
          tempHousingVolunteer: dataRow?.tempHousingAssignment?.volunteerUserId,
          modified: new Date(dataRow.modifiedAt),
        }

        if(dataRow.studentProfile.majorReferenceId !== null) {
          retRow.major = referencesById['Major'][dataRow.studentProfile.majorReferenceId];
        }

        if(dataRow.studentFlightInfo.arrivalAirlineReferenceId !== null) {
          retRow.arrivalAirline = referencesById['Airline'][dataRow.studentFlightInfo.arrivalAirlineReferenceId];
        }

        if (tempHousingAssignmentsMap[retRow.studentUserId]) {
          retRow.rowSelected = true;
        }
        
        return retRow
      });

      
      formattedDataRows.sort(function(a, b) {
        // if rowSelected is true, then it should be at the top
        if(a.rowSelected && !b.rowSelected)
        {
          return -1;
        }
        else if(!a.rowSelected && b.rowSelected)
        {
          return 1;
        }

        return 0;
      });

      return formattedDataRows;
    }, []);
      
    const fetchTempHousingNeeds = useCallback(async (referencesById, tempHousingAssignmentsMap) => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getTempHousingNeeds`);
        let fetchedTempHousingNeeds = axiosResponse.data.result.students;

        let formattedTempHousingNeeds = formatDataRows(fetchedTempHousingNeeds, referencesById, tempHousingAssignmentsMap);

        setTempHousingNeeds(formattedTempHousingNeeds);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }, [formatDataRows]);

    const fetchTempHousingAssignments = useCallback(async (referencesById) => {
      try {
        let axiosResponse;
        if(viewAssigned) {
          axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getTempHousingAssignments/${node.data.volunteerUserId}`, {
            params: {
              includeStudentDetails: true,
            }
          });
        } else {
          axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getTempHousingAssignments/${node.data.volunteerUserId}`);
        }

        let fetchedTempHousingAssignments = axiosResponse.data.result.tempHousingAssignments;

        let extractedTempHousingAssignments = fetchedTempHousingAssignments.map(function(tempHousingAssignment) {
          return tempHousingAssignment.studentUserId;
        });

        extractedTempHousingAssignments.sort();

        let tempHousingAssignmentsMap = {};

        for (let tempHousingAssignment of fetchedTempHousingAssignments) {
          tempHousingAssignmentsMap[tempHousingAssignment.studentUserId] = tempHousingAssignment;
        }

        setTempHousingAssignments(extractedTempHousingAssignments);
        setSelectedTempHousingNeeds(extractedTempHousingAssignments);

        if(viewAssigned)
        {
            let assignedStudents = fetchedTempHousingAssignments.map(function(tempHousingAssignment) {
            let assignedStudentDetails = tempHousingAssignment.student;

            // Add the volunteerUserId to the student details
            assignedStudentDetails['tempHousingAssignment'] = {}
            assignedStudentDetails['tempHousingAssignment']['volunteerUserId'] = tempHousingAssignment.volunteerUserId;
            return tempHousingAssignment.student;
            });

            let formattedAssignedStudents = formatDataRows(assignedStudents, referencesById, tempHousingAssignmentsMap);

            setTempHousingNeeds(formattedAssignedStudents);
        }
        else
        {
            fetchTempHousingNeeds(referencesById, tempHousingAssignmentsMap);
        }
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }, [node.data.volunteerUserId, viewAssigned, fetchTempHousingNeeds, formatDataRows]);

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
  
        fetchTempHousingAssignments(referencesById);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        setServerError(errorMessage);
      }
    }, [fetchTempHousingAssignments]);

    const sendUpdateTempHousingAssignmentsRequest = async (submittedTempHousingNeeds) => {
      try {
        let preparedVolunteerTempHousingAssignments = submittedTempHousingNeeds.map(function(studentUserId) {
          return {
            studentUserId: studentUserId,
          }
        });
  
        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateTempHousingAssignments/${node.data.volunteerUserId}`,
          {
            tempHousingAssignments: preparedVolunteerTempHousingAssignments,
          });
  
        setServerError('');

        alert('The volunteer temp housing assignments have been updated successfully!');
  
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
          headerName: 'Nights',
          field: 'numNights',
          width: 100,
        },
        {
          headerName: 'Assigned To',
          field: 'tempHousingVolunteer',
          textFilter: true,
          width: 120,
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
      let selectedTempHousingNeeds = [];
  
      selectedNodes.forEach((selectedNode) => {
        selectedTempHousingNeeds.push(selectedNode.data.studentUserId);
      });
  
      selectedTempHousingNeeds.sort();
  
      setSelectedTempHousingNeeds(selectedTempHousingNeeds);
    };
  
    const handleSubmit = () => {
      let selectedNodes = gridRef.current?.api.getSelectedNodes();
  
      let submittedTempHousingNeeds = [];
  
      selectedNodes.forEach((selectedNode) => {
        submittedTempHousingNeeds.push(selectedNode.data.studentUserId);
      });
  
      submittedTempHousingNeeds.sort();
  
      sendUpdateTempHousingAssignmentsRequest(submittedTempHousingNeeds);
    }
  
    
    const isRowSelectable = (params) => {
      if (!params.data.tempHousingVolunteer)
      {
        return true;
      }

      if(params.data.tempHousingVolunteer !== node.data.volunteerUserId)
      {
        return false;
      }

      return true;
    };

    const modalTitle = viewAssigned ?
      'View Temporary Housing Task(s) of ' + node.data.firstName + ' ' + node.data.lastName : 
      'Assign Temporary Housing Task(s) to ' + node.data.firstName + ' ' + node.data.lastName;

    const contentAlert = 'This table below displays all students that ' + ( viewAssigned ? 'are assigned to this volunteer' : 'need temporary housing.' );

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
              rowData={tempHousingNeeds}
              pagination={true}
              rowSelection={'multiple'}
              isRowSelectable={isRowSelectable}
              onRowSelected={handleRowSelected}
            />
          </Modal.Body>
          <Modal.Footer>
            { viewAssigned ? null :

              <Button variant="primary" onClick={handleSubmit} disabled={magicDataGridUtils.arraysAreIdentical(tempHousingAssignments, selectedTempHousingNeeds)}>
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

export default AssignHostStudentsModal;