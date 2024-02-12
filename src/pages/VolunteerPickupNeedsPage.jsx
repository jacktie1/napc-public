import React, {useState, useEffect} from 'react';
import ApathNavbar from '../components/ApathNavbar';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';

const VolunteerPickupNeedsPage = () => {
  const [airportPickupNeeds, setAirportPickupNeeds] = useState([]);

  useEffect(() => {
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchData = () => {
      setAirportPickupNeeds([{
        "rowSelected": true,
        "id": '1024',
        "major": 'CS',
        'return': 'FirstTime',
        'airlineName': 'Delta',
        'flightNumber': 'DL2178',
        'arrivalDate': '2023-08-16',
        'arrivalTime': '16:18'
      },
      {
        "id": '4432',
        "major": 'ECE',
        'return': 'FirstTime',
        'airlineName': 'QQ',
        'flightNumber': 'QQ123',
        'arrivalDate': '2023-10-12',
        'arrivalTime': '08:15'
      },
      {
        "id": '9527',
        "major": 'Math',
        'return': 'FirstTime',
        'airlineName': 'MM',
        'flightNumber': 'MM123',
        'arrivalDate': '2023-02-12',
        'arrivalTime': '07:15'
      },
      {
        "rowSelected": true,
        "id": '1022',
        "major": 'BIOS',
        'return': 'FirstTime',
        'airlineName': 'SQ',
        'flightNumber': 'SQ7721',
        'arrivalDate': '2023-10-12',
        'arrivalTime': '16:15'
      },
    ])};

    fetchData();
  }, []);

  const columns = [
    {
      headerName: 'Student Id',
      field: 'id',
      checkboxSelection: true,
    },
    {
      headerName: 'Major',
      field: 'major',
    },
    {
      headerName: 'Return',
      field: 'return',
    },
    {
      headerName: 'Airline Name',
      field: 'airlineName',
    },
    {
      headerName: '	Flight Number',
      field: 'flightNumber',
      width: 200,
    },
    {
      headerName: 'Arrive Date',
      field: 'arrivalDate',
      sort: 'asc',
      sortIndex: 0,
    },
    {
      headerName: 'Arrive Time',
      field: 'arrivalTime',
      sort: 'asc',
      sortIndex: 1,
    },
  ];

  const handleRowSelected = (event) => {
    if(event.node.isSelected())
    {
      alert('Selected ' + event.node.data.id);
    }
    else
    {
      alert('Deselected ' + event.node.data.id);
    }
  };

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
                Please click the checkbox if you are available to pick up.<br/><br/>
                Give the preference to first-time student.
                First-time means this is their first time attending this university<br/><br/>
                Note: Checking box only informs the administrator your availability.
                It does not mean you will be required to pick up. The administrator will assign the pick up task based on other information such as the size of your car.
                You will receive a confirmation email if assigned.
            </Alert>
            <MultipleSortingInfo/>
            <MagicDataGrid
              gridStyle={{height: 800}}
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