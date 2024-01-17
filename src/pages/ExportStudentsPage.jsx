import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import XLSX from 'sheetjs-style';
import Papa from "papaparse";

const ExportStudentsPage = () => {
    const [studentData, setStudentData] = useState([]);

    const gridRef = useRef();

    useEffect(() => {
        // Fetch data from API and set it in the state
        // For demonstration purposes, assuming you have a function fetchDataFromApi
        // Replace this with your actual API fetching logic
        const fetchData = () => {
          const fetchedData = [
            {
              "id": '331',
              "lastName": 'Zhao',
              'firstName': 'Siming',
              'gender': 'F',
              'isNew': 'Yes',
              'major': 'Biological Science',
              'airlineName': 'Delta',
              'arrivalDate': new Date('2024/08/18'),
              'arrivalTime': '00:01',
              'flightNumber': 'DL772',
              'requiresAirportPickup': 'Yes',
              'requiresTempHousing': 'Yes',
              'airportPickupVolunteer': '921',
              'tempHousingVolunteer': '1024',
              'modified': '07/18/2023 07:07:06'
            },
            {
              "id": '222',
              "lastName": 'Zhiming',
              'firstName': 'Qi',
              'gender': 'M',
              'isNew': 'Yes',
              'major': 'Medical',
              'airlineName': 'American',
              'arrivalDate': new Date('2024/09/12'),
              'arrivalTime': '11:02',
              'flightNumber': 'AA331',
              'requiresAirportPickup': 'Yes',
              'requiresTempHousing': 'Yes',
              'airportPickupVolunteer': '921',
              'tempHousingVolunteer': '1066',
              'modified': '05/18/2023 06:07:06'
            },
            {
              "id": '555',
              "lastName": 'Zhou',
              'firstName': 'Fang',
              'gender': 'M',
              'isNew': 'No',
              'major': 'Machine Learning',
              'airlineName': 'United',
              'arrivalDate': new Date('2024/09/12'),
              'arrivalTime': '14:55',
              'flightNumber': 'UA083',
              'requiresAirportPickup': 'Yes',
              'requiresTempHousing': 'Yes',
              'airportPickupVolunteer': '17',
              'tempHousingVolunteer': '1024',
              'modified': '01/14/2023 07:07:06'
            },
            {
              "id": '1010',
              "lastName": 'Wenrui',
              'firstName': 'Zhang',
              'gender': 'F',
              'isNew': 'Yes',
              'major': 'Human Computer Interaction',
              'airlineName': 'United',
              'arrivalDate': new Date('2024/09/17'),
              'arrivalTime': '16:55',
              'flightNumber': 'UA083',
              'requiresAirportPickup': 'Yes',
              'requiresTempHousing': 'No',
              'airportPickupVolunteer': '331',
              'tempHousingVolunteer': null,
              'modified': '01/19/2023 07:07:06'
            },
          ];

            setStudentData(fetchedData);
        };
    
        fetchData();
      }, []);
    
      const columns = [
        {
          headerName: 'Student Id',
          field: 'id',
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
          field: 'isNew',
          booleanFilter: true,
        },
        {
          headerName: 'Major',
          field: 'major',
          textFilter: true,
        },
        {
            headerName: 'Arri FN',
            field: 'flightNumber',
            textFilter: true,
            width: 120,
        },
        {
          headerName: 'Arri AirL',
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
            headerName: 'Pk. Req',
            field: 'requiresAirportPickup',
            booleanFilter: true,
            width: 120,
        },
        {
          headerName: 'Hous. Req',
          field: 'requiresTempHousing',
          booleanFilter: true,
          width: 120,
        },
        {
            headerName: 'PV Assigned',
            field: 'airportPickupVolunteer',
            textFilter: true,
            width: 120,
        },
        {
          headerName: 'HV Assigned',
          field: 'tempHousingVolunteer',
          textFilter: true,
          width: 120,
        },
        {
          headerName: 'Modified',
          field: 'modified',
        },
    ];

    const handleExportAsCSV = useCallback((exportedRows) => {
      const fileName = exportedRows === 'all' ? 'students_export_all.csv' : 'studentss_export_filtered.csv';

      gridRef.current?.api.exportDataAsCsv(
          {
            fileName: fileName,
            exportedRows: exportedRows
          }
      );
    }, []);

  const handleExportAsExcel = useCallback((exportedRows) => {
    const fileName = exportedRows === 'all' ? 'students_export_all.xlsx' : 'students_export_filtered.xlsx';

    const csvData = gridRef.current?.api.getDataAsCsv(
        {
            exportedRows: exportedRows
        }
    );

    Papa.parse(
      csvData, 
      {
        header: true,
        complete: function(parsed_csv) {
          console.log(parsed_csv.data);
          const ws = XLSX.utils.json_to_sheet(parsed_csv.data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "sheet");
          XLSX.writeFile(wb, fileName);
        },
        error: (error) => {
          alert('Error generating the Excel');
        },
      }
    );
  }, []);

    return (
        <div>
          <AdminNavbar />
    
          <Container className="mt-5" fluid>
            <Row className="mt-5 admin-pretty-box-layout">
              <Col className="pretty-box">
                <h2 className="pretty-box-heading">Export Students</h2>
                <Alert dismissible variant='info'>
                    This page displays all students. Click <b>Export</b> button to export students (filtered only).
                </Alert>
                <MultipleSortingInfo/>
                <div className='py-3'>
                    <span className='mx-1'>
                        <Button variant="success" onClick={() => handleExportAsCSV('all')}>
                            Export CSV (All)
                        </Button>
                    </span>
                    <span className='mx-1'>
                        <Button variant="success" onClick={() => handleExportAsCSV('filteredAndSorted')}>
                            Export CSV (Filtered Only)
                        </Button>
                    </span>
                    <span className='mx-1'>
                        <Button variant="success" onClick={() => handleExportAsExcel('all')}>
                            Export Excel (All)
                        </Button>
                    </span>
                    <span className='mx-1'>
                        <Button variant="success" onClick={() => handleExportAsExcel('filteredAndSorted')}>
                            Export Excel (Filtered Only)
                        </Button>
                    </span>
                </div>
                <MagicDataGrid
                  innerRef={gridRef}
                  gridStyle={{height: 800}}
                  columnDefs={columns}
                  rowData={studentData}
                  pagination={true}
                />
              </Col>
            </Row>
          </Container>
        </div>
      );
  };

export default ExportStudentsPage;
