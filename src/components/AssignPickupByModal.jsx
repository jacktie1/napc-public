import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import { Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';


const AssignPickupByModal = ({ value, node }) => {
    const [serverError, setServerError] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [volunteerData, setVolunteerData] = useState([]);

    const [originalAssignee, setOriginalAssignee] = useState('');
    const [currentAssignee, setCurrentAssignee] = useState('');

    const gridRef = useRef();

    const fetchData = useCallback(async () => {
      try {
          // Clear the assignee state
          setOriginalAssignee('');
          setCurrentAssignee('');

          let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getVolunteers`, {
              params: {
                providesAirportPickup: true,
                includeAirportPickupAssignments: true,
                includeAirportPickupPreferences: true,
              }
          }); 
          
          let fetchedVolunteers = axiosResponse.data.result.volunteers;

          let formattedVolunteers = fetchedVolunteers.map(function(volunteer) {
            let retRow = {
              volunteerUserId: volunteer.userAccount.userId,
              lastName: volunteer.volunteerProfile.lastName,
              firstName: volunteer.volunteerProfile.firstName,
              gender: magicDataGridUtils.toGenderValue(volunteer.volunteerProfile.gender),
              emailAddress: volunteer.volunteerProfile.emailAddress,
              primaryPhoneNumber: volunteer.volunteerProfile.primaryPhoneNumber,
              airportPickupStudents: volunteer?.airportPickupAssignments?.map(assignment => assignment.studentUserId),
              preferredThisStudent: magicDataGridUtils.toYesOrNoValue(false),
              modified: new Date(volunteer.modifiedAt),
            }

            let airportPickupPreferences = volunteer?.airportPickupPreferences;

            if(airportPickupPreferences !== null)
            {
              let airportPikcupPreferenceStudentIds = airportPickupPreferences.map(preference => preference.studentUserId);
              retRow.preferredThisStudent = magicDataGridUtils.toYesOrNoValue(airportPikcupPreferenceStudentIds.includes(node.data.studentUserId));
            }

            let airportPickupAssignments = volunteer?.airportPickupAssignments;

            if(airportPickupAssignments !== null)
            {
              let airportPickupAssignmentStuentIds = airportPickupAssignments.map(assignment => assignment.studentUserId);
              retRow.rowSelected = airportPickupAssignmentStuentIds.includes(node.data.studentUserId);

              if(retRow.rowSelected)
              {
                setOriginalAssignee(volunteer.userAccount.userId);
                setCurrentAssignee(volunteer.userAccount.userId);
              }
            }

            return retRow;
          });

          formattedVolunteers.sort(function(a, b) {
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

          setVolunteerData(formattedVolunteers);
      }
      catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }, [node.data.studentUserId]);

    const sendUpdateAirportPickupAssignmentRequest = async (selectedVolunteer) => {
      try {
        let studentUserId = node.data.studentUserId;

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateAirportPickupAssignment/${studentUserId}`, {
          volunteerUserId: selectedVolunteer,
        });

        alert('The pickup volunteer has been updated successfully.');

        node.setData({
          ...node.data,
          airportPickupVolunteer: selectedVolunteer,
        });

        fetchData();
      }
      catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }

    useEffect(() => {
        if (showModal)
        {
          fetchData();
        }
      }, [showModal, fetchData]);
    
    const columns = [
      {
        headerName: 'Volunteer Id',
        field: 'volunteerUserId',
        checkboxSelection: true,
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
          headerName: 'Pref',
          field: 'preferredThisStudent',
          booleanFilter: true,
      },
      {
          headerName: 'Assign ST',
          field: 'airportPickupStudents',
          isArray: true,
          textFilter: true,
      },
      {
          headerName: 'Modified',
          field: 'modified',
          isTimestamp: true,
      },
    ];
  
    const handleClose = () => {
      setShowModal(false);
    };

    const handleShow = () => {
      setShowModal(true);
    };

    const handleRowSelected = () => {
      let selectedNodes = gridRef.current?.api.getSelectedNodes();

      if(selectedNodes.length === 0)
      {
        setCurrentAssignee('');
      }
      else
      {
        setCurrentAssignee(selectedNodes[0].data.volunteerUserId);
      }
    }

    const handleSubmit = () => {
        let selectedNodes = gridRef.current?.api.getSelectedNodes();

        let selectedVolunteer = null;

        if(selectedNodes.length > 0)
        {
          selectedVolunteer = selectedNodes[0].data.volunteerUserId;
        }

        sendUpdateAirportPickupAssignmentRequest(selectedVolunteer);
    }

    return (
      <>
        <div onClick={handleShow} className='hyperlink'>
          {value}
        </div>

        <Modal show={showModal} onHide={handleClose} centered fullscreen>
          <Modal.Header closeButton>
            <Modal.Title>Assign a Pickup Volunteer to {node.data.firstName} {node.data.lastName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert dismissible variant='info'>
                This table below displays all airport pickup volunteers.
            </Alert>
            <Alert dismissible variant='secondary'>
                Click the checkbox below will assign the volunteer to this student.<br/><br/>
                For any changes you have made on this page, please click the <b>Submit</b> button at the bottom of the page.
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
              rowData={volunteerData}
              pagination={true}
              rowSelection={'single'}
              onRowSelected={handleRowSelected}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSubmit} disabled={originalAssignee === currentAssignee}>
                Submit
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

export default AssignPickupByModal;