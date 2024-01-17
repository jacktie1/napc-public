import React, {useState, useEffect, useRef} from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';

const AssignPickupByModal = ({ value, node }) => {
    const [showModal, setShowModal] = useState(false);

    const [volunteerData, setVolunteerData] = useState([]);

    const [originalAssignee, setOriginalAssignee] = useState('');

    const gridRef = useRef();

    useEffect(() => {
        // Fetch data from API and set it in the state
        // For demonstration purposes, assuming you have a function fetchDataFromApi
        // Replace this with your actual API fetching logic
        const fetchData = () => {
          if (!showModal)
          {
            return;
          }

          const fetchedData = [
            {
              "id": '331',
              "lastName": 'Zhao',
              'firstName': 'Siming',
              'gender': 'F',
              'emailAddress': 'sming@gmail.com',
              'primaryPhoneNumber': '123-344-1223',
              'preferredStudent': 'No',
              'assignedStudents': ['1024', '9932'],
              'modified': '07/18/2023 07:07:06'
            },
            {
              "id": '222',
              "lastName": 'Zhiming',
              'firstName': 'Qi',
              'gender': 'M',
              'emailAddress': 'zmingqi@gmail.com',
              'primaryPhoneNumber': '566-344-1111',
              'preferredStudent': 'Yes',
              'assignedStudents': ['11', '9'],
              'modified': '05/18/2023 07:07:06'
            },
            {
              "id": '555',
              "lastName": 'Zhou',
              'firstName': 'Fang',
              'gender': 'M',
              'emailAddress': 'zhouzhou@gmail.com',
              'primaryPhoneNumber': '999-777-4444',
              'preferredStudent': 'No',
              'assignedStudents': ['81', '211', '100'],
              'modified': '01/18/2023 07:07:06'
            },
          ];

          fetchedData.forEach(row => {
            if(row.id === node.data.airportPickupVolunteer)
            {
              row.rowSelected = true;
            }
          });

          setVolunteerData(fetchedData);

          setOriginalAssignee(node.data.airportPickupVolunteer);
        };
    
        fetchData();
      }, [showModal]);
    
      const columns = [
        {
          headerName: 'Volunteer Id',
          field: 'id',
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
            field: 'preferredStudent',
            booleanFilter: true,
        },
        {
            headerName: 'Assign ST',
            field: 'assignedStudents',
            isArray: true,
            textFilter: true,
        },
        {
            headerName: 'Modified',
            field: 'modified',
        },
      ];
  
    const handleClose = () => {
      setShowModal(false);
    };

    const handleShow = () => {
      setShowModal(true);
    };

    const handleSubmit = () => {
        const selectedNodes = gridRef.current?.api.getSelectedNodes();

        if(selectedNodes.length === 0)
        {
            alert('No volunteer selected');
            node.updateData({...node.data, airportPickupVolunteer: null});
        }
        else
        {
          const currentAssignee = selectedNodes[0].data.id;

          if(currentAssignee === originalAssignee)
          {
            alert('Still assigned to ' + currentAssignee);
          }
          else
          {
            alert('Reassigned to ' + currentAssignee);
          }

          node.updateData({...node.data, airportPickupVolunteer: currentAssignee});
        }

        handleClose();
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
                This table below displays all pickup volunteers.
            </Alert>
            <Alert dismissible variant='secondary'>
                Click the checkbox below will assign the volunteer to this student.<br/><br/>
                For any changes you have made on this page, please click the <b>Submit</b> button at the bottom of the page.
            </Alert>
            <MultipleSortingInfo/>
            <MagicDataGrid
              innerRef={gridRef}
              gridStyle={{height: 720}}
              columnDefs={columns}
              rowData={volunteerData}
              pagination={true}
              rowSelection={'single'}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSubmit}>
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