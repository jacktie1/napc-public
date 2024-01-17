import React, {useState, useEffect, useRef} from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from './MagicDataGrid';
import MultipleSortingInfo from './MultipleSortingInfo';

const AssignHostedByModal = ({ value, node }) => {
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
              'sex': 'F',
              'emailAddress': 'sming@gmail.com',
              'primaryPhoneNumber': '123-344-1223',
              'homeAddress': '3330 Lake',
              'assignedStudents': ['1024', '9932'],
              'modified': '07/18/2023 07:07:06'
            },
            {
              "id": '222',
              "lastName": 'Zhiming',
              'firstName': 'Qi',
              'sex': 'M',
              'emailAddress': 'zmingqi@gmail.com',
              'primaryPhoneNumber': '566-344-1111',
              'homeAddress': '3890 Oak Lane, Marietta, 30062',
              'assignedStudents': ['11', '9'],
              'modified': '05/18/2023 07:07:06'
            },
            {
              "id": '555',
              "lastName": 'Zhou',
              'firstName': 'Fang',
              'sex': 'M',
              'emailAddress': 'zhouzhou@gmail.com',
              'primaryPhoneNumber': '999-777-4444',
              'homeAddress': '416 Ethel Street NW. Atlanta, Ga 30318',
              'assignedStudents': ['81', '211', '100'],
              'modified': '01/18/2023 07:07:06'
            },
          ];

          fetchedData.forEach(row => {
            if(row.id === node.data.tempHousingVolunteer)
            {
              row.rowSelected = true;
            }
          });

          setVolunteerData(fetchedData);

          setOriginalAssignee(node.data.tempHousingVolunteer);
        };
    
        fetchData();
      }, [showModal]);
    
      const columns = [
        {
          headerName: 'Volunteer Id',
          field: 'id',
          checkboxSelection: true,
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
            headerName: 'Address',
            field: 'homeAddress',
            textFilter: true,
            minWidth: 300,
        },
        {
            headerName: 'Assign HS',
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
            node.updateData({...node.data, tempHousingVolunteer: null});
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

          node.updateData({...node.data, tempHousingVolunteer: currentAssignee});
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
            <Modal.Title>Assign a Housing Volunteer to {node.data.firstName} {node.data.lastName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert dismissible variant='info'>
                This table below displays all housing volunteers.
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

export default AssignHostedByModal;