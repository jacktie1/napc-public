import React, { useState, useEffect, useRef, useCallback } from 'react';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import XLSX from 'sheetjs-style';
import Papa from "papaparse";

const ExportVolunteersPage = () => {
    const [volunteerData, setVolunteerData] = useState([]);

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
              'providesAirportPickup': 'Yes',
              'providesTempHousing': 'Yes',
              'airportPickupStudents': ['921'],
              'tempHousingStudents': ['1024'],
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
              'providesAirportPickup': 'Yes',
              'providesTempHousing': 'Yes',
              'airportPickupStudents': ['921','9912'],
              'tempHousingStudents': ['1066','88','3251'],
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
              'providesAirportPickup': 'Yes',
              'providesTempHousing': 'Yes',
              'airportPickupStudents': ['17','23','666'],
              'tempHousingStudents': ['1024'],
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
              'providesAirportPickup': 'Yes',
              'providesTempHousing': 'No',
              'airportPickupStudents': ['331'],
              'tempHousingStudents': null,
              'modified': '01/19/2023 07:07:06'
            },
          ];

            setVolunteerData(fetchedData);
        };
    
        fetchData();
      }, []);
    
      const columns = [
        {
          headerName: 'Volunteer Id',
          field: 'id',
          textFilter: true,
          width: 120,
        },
        {
          headerName: 'Last Name',
          field: 'lastName',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'First Name',
          field: 'firstName',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Gender',
          field: 'gender',
          genderFilter: true,
          width: 150,
        },
        {
            headerName: 'Pk. Prov.',
            field: 'providesAirportPickup',
            booleanFilter: true,
            width: 200,
        },
        {
          headerName: 'Hous. Prov.',
          field: 'providesTempHousing',
          booleanFilter: true,
          width: 200,
        },
        {
            headerName: 'PS Assigned',
            field: 'airportPickupStudents',
            textFilter: true,
            isArray: true,
            width: 300,
        },
        {
          headerName: 'HS Assigned',
          field: 'tempHousingStudents',
          textFilter: true,
          isArray: true,
          width: 300,
        },
        {
          headerName: 'Modified',
          field: 'modified',
        },
    ];

    const handleExportAsCSV = useCallback((exportedRows) => {
        const fileName = exportedRows === 'all' ? 'volunteers_export_all.csv' : 'volunteers_export_filtered.csv';

        gridRef.current?.api.exportDataAsCsv(
            {
              fileName: fileName,
              exportedRows: exportedRows
            }
        );
      }, []);

    const handleExportAsExcel = useCallback((exportedRows) => {
      const fileName = exportedRows === 'all' ? 'volunteers_export_all.xlsx' : 'volunteers_export_filtered.xlsx';

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
          <ApathNavbar />
    
          <Container className="mt-5" fluid>
            <Row className="mt-5 admin-pretty-box-layout">
              <Col className="pretty-box">
                <h2 className="pretty-box-heading">Export Volunteers</h2>
                <Alert dismissible variant='info'>
                    This page displays all volunteers. Click <b>Export</b> button to export volunteers (filtered only).
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
                  rowData={volunteerData}
                  pagination={true}
                />
              </Col>
            </Row>
          </Container>
        </div>
      );
  };

export default ExportVolunteersPage;
