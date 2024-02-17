import React, {useState, useEffect, useRef} from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Row, Col, Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import VolunteerDetailsModal from '../components/VolunteerDetailsModal';
import * as magicGridUtils from '../utils/magicGridUtils';


const ManageVolunteersPage = () => {
  const [serverError, setServerError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [volunteerData, setVolunteerData] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  const gridRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

    // Fetch data from API and set it in the state
  // For demonstration purposes, assuming you have a function fetchDataFromApi
  // Replace this with your actual API fetching logic
  const fetchData = async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getVolunteers`);
      let fetechedVolunteers = axiosResponse.data.result.volunteers;

      let formattedVolunteers = fetechedVolunteers.map(function(volunteer) {
        let retRow = {
          userId: volunteer.userAccount.userId,
          lastName: volunteer.volunteerProfile.lastName,
          firstName: volunteer.volunteerProfile.firstName,
          emailAddress: volunteer.volunteerProfile.emailAddress,
          primaryPhoneNumber: volunteer.volunteerProfile.primaryPhoneNumber,
          secondaryPhoneNumber: volunteer.volunteerProfile.secondaryPhoneNumber,
          gender: magicGridUtils.toGenderValue(volunteer.volunteerProfile.gender),
          providesAirportPickup: magicGridUtils.toYesOrNoValue(volunteer.volunteerAirportPickup.providesAirportPickup),
          providesTempHousing: magicGridUtils.toYesOrNoValue(volunteer.volunteerTempHousing.providesTempHousing),
          userEnabled: magicGridUtils.toYesOrNoValue(volunteer.volunteerProfile.enabled),
          modifiedAt: new Date(volunteer.modifiedAt),
        }

        return retRow
      });

      setVolunteerData(formattedVolunteers);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };

  const handleVolunteerDetailsModalClose = () => {
    fetchData();
  };

  const columns = [
    {
      headerName: 'Volunteer Id',
      field: 'userId',
      checkboxSelection: true,
      cellRenderer: VolunteerDetailsModal,
      cellRendererParams: {
        readOnly: false,
        adminView: true,
        onClose: handleVolunteerDetailsModalClose,
      },
      textFilter: true,
      minWidth: 100,
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      textFilter: true,
      minWidth: 150,
    },
    {
      headerName: 'First Name',
      field: 'firstName',
      textFilter: true,
      minWidth: 150,
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
      minWidth: 250,
    },
    {
      headerName: 'Phone No',
      field: 'primaryPhoneNumber',
      textFilter: true,
      minWidth: 150,
    },
    {
      headerName: 'BK Phone',
      field: 'secondaryPhoneNumber',
      textFilter: true,
      minWidth: 150,
    },
    {
      headerName: 'PK Prov',
      field: 'providesAirportPickup',
      booleanFilter: true,
    },
    {
      headerName: 'HS Prov',
      field: 'providesTempHousing',
      booleanFilter: true,
    },
    {
      headerName: 'Enabled',
      field: 'userEnabled',
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
    let volunteerId = event.node.data.userId;

    if(event.node.isSelected())
    {
      setSelectedVolunteers(selectedVolunteers => [...selectedVolunteers, volunteerId]);
    }
    else
    {
      setSelectedVolunteers(selectedVolunteers => selectedVolunteers.filter(
        (volunteer) => volunteer !== volunteerId
      ));
    }
  };

  const sendDeleteVolunteersRequest = async () => {
    try {
      await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/deleteUsers`, {
        data: {
         userIds: selectedVolunteers,
        }
      });

      setVolunteerData(volunteerData => volunteerData.filter(
        (volunteerRow) => !(selectedVolunteers.includes(volunteerRow.userId))
      ));
  
      setSelectedVolunteers([]);

      gridRef.current?.api.deselectAll();

      alert('Volunteers deleted successfully!');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };

  const handleDeleteVolunteers = () => {
    handleCloseConfirmModal();
    sendDeleteVolunteersRequest();
  }

  return (
    <div>
      <ApathNavbar />

      <Container className="mt-5" fluid>
        <Row className="mt-5 admin-pretty-box-layout">
          <Col className="pretty-box">
            <h2 className="pretty-box-heading">Manage Volunteers</h2>
            <Alert dismissible variant='info'>
              This page allows admin to edit or delete volunteer users.
            </Alert>
            <Alert dismissible variant='secondary'>
              This table below displays all volunteers. Click the ID to edit a volunteer.
            </Alert>
            <MultipleSortingInfo/>
            <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
            <div className='py-3'>
              <Button variant="danger" onClick={handleShowConfirmModal} disabled={selectedVolunteers.length===0}>
                  Delete Selected Volunteers
              </Button>
            </div>
            <MagicDataGrid
              innerRef={gridRef}
              gridStyle={{height: 800}}
              columnDefs={columns}
              rowData={volunteerData}
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
          Do you want to delete all the selected volunteer users？<br/><br/>
          {selectedVolunteers.join(',')}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Cancel
        </Button>
        <Button variant="primary" onClick={handleDeleteVolunteers}>
            Confirm
        </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageVolunteersPage;