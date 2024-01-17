import React, {useState, useEffect, useRef} from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Container, Row, Col, Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import VolunteerDetailsModal from '../components/VolunteerDetailsModal';

const ManageVolunteersPage = () => {
  const [volunteerData, setVolunteerData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const gridRef = useRef();
  useEffect(() => {
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchData = () => {
      setVolunteerData([
        {
          "id": '1024',
          "lastName": 'Zhao',
          'firstName': 'Siming',
          'sex': 'F',
          'emailAddress': 'sming@gmail.com',
          'primaryPhoneNumber': '123-344-1223',
          'secondaryPhoneNumber': '555-555-5555',
          'providesPickup': 'Yes',
          'providesTempHousing': 'No',
          'userEnabled': 'Yes',
          'modified': '07/18/2023 07:07:06'
        },
        {
          "id": '1066',
          "lastName": 'Zhiming',
          'firstName': 'Qi',
          'sex': 'M',
          'emailAddress': 'zmingqi@gmail.com',
          'primaryPhoneNumber': '566-344-1111',
          'secondaryPhoneNumber': '666-666-6666',
          'providesPickup': 'Yes',
          'providesTempHousing': 'Yes',
          'userEnabled': 'No',
          'modified': '05/18/2023 07:07:06'
        },
        {
          "id": '1078',
          "lastName": 'Zhou',
          'firstName': 'Fang',
          'sex': 'M',
          'emailAddress': 'zhouzhou@gmail.com',
          'primaryPhoneNumber': '999-777-4444',
          'secondaryPhoneNumber': '225-123-123',
          'providesPickup': 'No',
          'providesTempHousing': 'Yes',
          'userEnabled': 'Yes',
          'modified': '01/18/2023 07:07:06'
        },
      ])
    };

    fetchData();
  }, []);

  const columns = [
    {
      headerName: 'Volunteer Id',
      field: 'id',
      checkboxSelection: true,
      cellRenderer: VolunteerDetailsModal,
      cellRendererParams: {
        readOnly: false,
        adminView: true,
      },
      textFilter: true,
      width: 100,
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
      headerName: 'Sex',
      field: 'sex',
      sexFilter: true,
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
      headerName: 'BK Phone',
      field: 'secondaryPhoneNumber',
      textFilter: true,
    },
    {
      headerName: 'PK Prov',
      field: 'providesPickup',
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
      field: 'modified',
    },
  ];

  const handleCloseConfirmModal = () => setShowConfirmModal(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);

  const handleRowSelected = (event) => {
    const volunteerId = event.node.data.id;

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

  const handleDeleteVolunteers = () => {
    console.log(selectedVolunteers)
    handleCloseConfirmModal();
    setVolunteerData(volunteerData => volunteerData.filter(
      (volunteerRow) => !(selectedVolunteers.includes(volunteerRow.id))
    ));
    setSelectedVolunteers([]);
    gridRef.current?.api.deselectAll();
  }

  return (
    <div>
      <AdminNavbar />

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