import React, {useState, useEffect, useRef} from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import MagicDataGrid from './MagicDataGrid';
import MultipleSortingInfo from './MultipleSortingInfo';

const AssignPickupStudentsModal = ({ value, node, valueFormatted, viewAssigned }) => {
    const [showModal, setShowModal] = useState(false);

    const [studentData, setStudentData] = useState([]);

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
              'isNew': 'Yes',
              'major': 'Biological Science',
              'airlineName': 'Delta',
              'arrivalDate': new Date('2024/08/18'),
              'arrivalTime': '00:01',
              'flightNumber': 'DL772',
              'numBigLuggages': '4',
              'airportPickupVolunteer': '1024',
              'preferredByVolunteer': 'Yes',
              'modified': '07/18/2023 07:07:06'
            },
            {
              "id": '222',
              "lastName": 'Zhiming',
              'firstName': 'Qi',
              'sex': 'M',
              'isNew': 'Yes',
              'major': 'Medical',
              'airlineName': 'American',
              'arrivalDate': new Date('2024/09/12'),
              'arrivalTime': '11:02',
              'flightNumber': 'AA331',
              'numBigLuggages': '2',
              'airportPickupVolunteer': '1066',
              'preferredByVolunteer': 'Yes',
              'modified': '05/18/2023 06:07:06'
            },
            {
              "id": '555',
              "lastName": 'Zhou',
              'firstName': 'Fang',
              'sex': 'M',
              'isNew': 'No',
              'major': 'Machine Learning',
              'airlineName': 'United',
              'arrivalDate': new Date('2024/09/12'),
              'arrivalTime': '14:55',
              'flightNumber': 'UA083',
              'numBigLuggages': '2',
              'airportPickupVolunteer': '1024',
              'preferredByVolunteer': 'No',
              'modified': '01/14/2023 07:07:06'
            },
            {
              "id": '1010',
              "lastName": 'Wenrui',
              'firstName': 'Zhang',
              'sex': 'F',
              'isNew': 'Yes',
              'major': 'Human Computer Interaction',
              'airlineName': 'United',
              'arrivalDate': new Date('2024/09/17'),
              'arrivalTime': '16:55',
              'flightNumber': 'UA083',
              'numBigLuggages': '3',
              'airportPickupVolunteer': null,
              'preferredByVolunteer': 'No',
              'modified': '01/19/2023 07:07:06'
            },
          ];

          if(viewAssigned)
          {
            const filteredFetchedData = fetchedData.filter((row) => row.airportPickupVolunteer === node.data.id);

            setStudentData(filteredFetchedData);
          }
          else
          {
            fetchedData.forEach(row => {
              if(Array.isArray(node.data.airportPickupStudents) && node.data.airportPickupStudents.includes(row.id))
              {
                row.rowSelected = true;
              }
            });

            setStudentData(fetchedData);
          }

        };
    
        fetchData();
      }, [showModal]);
    
      const columns = [
        {
          headerName: 'Student Id',
          field: 'id',
          checkboxSelection: viewAssigned? false : true,
          showDisabledCheckboxes: true,
          textFilter: true,
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
          headerName: 'First Time',
          field: 'isNew',
          booleanFilter: true,
        },
        {
          headerName: 'Major',
          field: 'major',
          textFilter: true,
        },
        {
          headerName: 'Air',
          field: 'airlineName',
          textFilter: true,
        },
        {
          headerName: 'Arr Date',
          field: 'arrivalDate',
          dateFilter: true,
        },
        {
          headerName: 'Arr Time',
          field: 'arrivalTime',
          width: 100,
        },
        {
          headerName: 'FN',
          field: 'flightNumber',
          textFilter: true,
          width: 120,
        },
        {
          headerName: 'BigLug',
          field: 'numBigLuggages',
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
          field: 'preferredByVolunteer',
          booleanFilter: true
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
            node.updateData({...node.data, airportPickupStudents: null});
        }
        else
        {
          const currentAssignees = [];
          
          selectedNodes.forEach(function(row) {
            currentAssignees.push(row.data.id);
          });

          node.updateData({...node.data, airportPickupStudents: currentAssignees});
        }

        handleClose();
    }
    
    const isRowSelectable = (params) => {
      if (!params.data.airportPickupVolunteer)
      {
        return true;
      }

      if(params.data.airportPickupVolunteer !== node.data.id)
      {
        return false;
      }

      return true;
    };

    const modalTitle = viewAssigned ?
      'View Pickup Tasks of ' + node.data.firstName + ' ' + node.data.lastName : 
      'Assign a Pickup Task to ' + node.data.firstName + ' ' + node.data.lastName;

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
            <MagicDataGrid
              innerRef={gridRef}
              gridStyle={{height: 720}}
              columnDefs={columns}
              rowData={studentData}
              pagination={true}
              rowSelection={'multiple'}
              isRowSelectable={isRowSelectable}
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

export default AssignPickupStudentsModal;