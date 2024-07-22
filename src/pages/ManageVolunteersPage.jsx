import React, {useState, useEffect, useRef} from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import VolunteerDetailsModal from '../components/VolunteerDetailsModal';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';


const ManageVolunteersPage = () => {
  const [serverError, setServerError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [volunteerData, setVolunteerData] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  const gridRef = useRef();

  const fetchData = async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getVolunteers`);
      let fetchedVolunteers = axiosResponse.data.result.volunteers;

      let formattedVolunteers = fetchedVolunteers.map(function(volunteer) {
        let retRow = {
          userId: volunteer.userAccount.userId,
          lastName: volunteer.volunteerProfile.lastName,
          firstName: volunteer.volunteerProfile.firstName,
          emailAddress: volunteer.volunteerProfile.emailAddress,
          primaryPhoneNumber: volunteer.volunteerProfile.primaryPhoneNumber,
          secondaryPhoneNumber: volunteer.volunteerProfile.secondaryPhoneNumber,
          gender: magicDataGridUtils.toGenderValue(volunteer.volunteerProfile.gender),
          providesAirportPickup: magicDataGridUtils.toYesOrNoValue(volunteer.volunteerAirportPickup.providesAirportPickup),
          providesTempHousing: magicDataGridUtils.toYesOrNoValue(volunteer.volunteerTempHousing.providesTempHousing),
          userEnabled: magicDataGridUtils.toYesOrNoValue(volunteer.volunteerProfile.enabled),
          modifiedAt: new Date(volunteer.modifiedAt),
          lastLoginTime: null,
        }

        if(volunteer.lastLoginTime)
        {
          retRow.lastLoginTime = new Date(volunteer.lastLoginTime);
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

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      headerName: 'Volunteer Id',
      field: 'userId',
      checkboxSelection: true,
      cellRenderer: VolunteerDetailsModal,
      cellRendererParams: {
        readOnly: false,
        adminView: true,
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
    {
      headerName: 'Last Login',
      field: 'lastLoginTime',
      isTimestamp: true,
    }
  ];

  const handleCloseConfirmModal = () => setShowConfirmModal(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);

  const handleRowSelected = (event) => {
    let volunteerUserId = event.node.data.userId;

    if(event.node.isSelected())
    {
      setSelectedVolunteers(selectedVolunteers => [...selectedVolunteers, volunteerUserId]);
    }
    else
    {
      setSelectedVolunteers(selectedVolunteers => selectedVolunteers.filter(
        (volunteer) => volunteer !== volunteerUserId
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
          columnDefs={columns}
          rowData={volunteerData}
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