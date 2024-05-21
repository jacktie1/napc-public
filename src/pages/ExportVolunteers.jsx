import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import XLSX from 'sheetjs-style';
import Papa from "papaparse";
import * as magicDataGridUtils from '../utils/magicDataGridUtils';


const ExportVolunteersPage = () => {
  const [serverError, setServerError] = useState('');

  const [volunteerData, setVolunteerData] = useState([]);

  const gridRef = useRef();

  const fetchData = useCallback(async() => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getVolunteers`, {
        params: {
          includeAirportPickupAssignments: true,
          includeTempHousingAssignments: true,
        }
      });

      let fetchedVolunteers = axiosResponse.data.result.volunteers;

      let formattedVolunteers = fetchedVolunteers.map(function(volunteer) {
        let retRow = {
          volunteerUserId: volunteer.userAccount.userId,
          lastName: volunteer.volunteerProfile.lastName,
          firstName: volunteer.volunteerProfile.firstName,
          emailAddress: volunteer.volunteerProfile.emailAddress,
          enabled: magicDataGridUtils.toYesOrNoValue(volunteer.volunteerProfile.enabled),
          gender: magicDataGridUtils.toGenderValue(volunteer.volunteerProfile.gender),
          affliation: volunteer.volunteerProfile.affiliation,
          primaryPhoneNumber: volunteer.volunteerProfile.primaryPhoneNumber,
          secondaryPhoneNumber: volunteer.volunteerProfile.secondaryPhoneNumber,
          wechatId: volunteer.volunteerProfile.wechatId,
          providesAirportPickup: magicDataGridUtils.toYesOrNoValue(volunteer.volunteerAirportPickup.providesAirportPickup),
          carManufacturer: volunteer.volunteerAirportPickup.carManufacturer,
          carModel: volunteer.volunteerAirportPickup.carModel,
          numCarSeats: volunteer.volunteerAirportPickup.numCarSeats,
          numMaxLgLuggages: volunteer.volunteerAirportPickup.numMaxLgLuggages,
          numMaxTrips: volunteer.volunteerAirportPickup.numMaxTrips,
          airportPickupComment: volunteer.volunteerAirportPickup.airportPickupComment,
          providesTempHousing: magicDataGridUtils.toYesOrNoValue(volunteer.volunteerTempHousing.providesTempHousing),
          homeAddress: volunteer.volunteerTempHousing.homeAddress,
          numMaxStudentsHosted: volunteer.volunteerTempHousing.numMaxStudentsHosted,
          tempHousingStartDate: magicDataGridUtils.getDate(volunteer.volunteerTempHousing.tempHousingStartDate),
          tempHousingEndDate: magicDataGridUtils.getDate(volunteer.volunteerTempHousing.tempHousingEndDate),
          numDoubleBeds: volunteer.volunteerTempHousing.numDoubleBeds,
          numSingleBeds: volunteer.volunteerTempHousing.numSingleBeds,
          genderPreference: magicDataGridUtils.toGenderValue(volunteer.volunteerTempHousing.genderPreference),
          providesRide: magicDataGridUtils.toYesOrNoValue(volunteer.volunteerTempHousing.providesRide),
          hasPet: magicDataGridUtils.toYesOrNoValue(volunteer.volunteerTempHousing.hasPet),
          petDescription: volunteer.volunteerTempHousing.petDescription,
          tempHousingComment: volunteer.volunteerTempHousing.tempHousingComment,
          airportPickupStudents: volunteer?.airportPickupAssignments?.map(assignment => assignment.studentUserId),
          tempHousingStudents: volunteer?.tempHousingAssignments?.map(assignment => assignment.studentUserId),
          modified: new Date(volunteer.modifiedAt),
        }

        return retRow
      });

      setVolunteerData(formattedVolunteers);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
    
      const columns = [
        {
          headerName: 'Volunteer Id',
          field: 'volunteerUserId',
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
          headerName: 'Email Address',
          field: 'emailAddress',
          textFilter: true,
          width: 200,
        },
        {
          headerName: 'Enabled',
          field: 'enabled',
          booleanFilter: true,
        },
        {
          headerName: 'Gender',
          field: 'gender',
          genderFilter: true,
          width: 150,
        },
        {
          headerName: 'Affiliation',
          field: 'affliation',
          textFilter: true,
          width: 200,
        },
        {
          headerName: 'Primary Phone No.',
          field: 'primaryPhoneNumber',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Backup Phone No.',
          field: 'secondaryPhoneNumber',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'WeChat',
          field: 'wechatId',
          textFilter: true,
          width: 150,
        },
        {
            headerName: 'Pk. Prov.',
            field: 'providesAirportPickup',
            booleanFilter: true,
            width: 200,
        },
        {
          headerName: 'Car Manufacturer',
          field: 'carManufacturer',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Car Model',
          field: 'carModel',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Car Seats',
          field: 'numCarSeats',
          numberFilter: true,
          width: 150,
        },
        {
          headerName: 'Lg Luggages',
          field: 'numMaxLgLuggages',
          numberFilter: true,
          width: 150,
        },
        {
          headerName: 'Max Trips',
          field: 'numMaxTrips',
          numberFilter: true,
          width: 150,
        },
        {
          headerName: 'Pk. Comment',
          field: 'airportPickupComment',
          textFilter: true,
          width: 200,
        },
        {
          headerName: 'Hous. Prov.',
          field: 'providesTempHousing',
          booleanFilter: true,
          width: 200,
        },
        {
          headerName: 'Home Address',
          field: 'homeAddress',
          textFilter: true,
          width: 200,
        },
        {
          headerName: 'Max Students',
          field: 'numMaxStudentsHosted',
          numberFilter: true,
          width: 150,
        },
        {
          headerName: 'HS Start Date',
          field: 'tempHousingStartDate',
          dateFilter: true,
          isDate: true,
          width: 150,
        },
        {
          headerName: 'HS End Date',
          field: 'tempHousingEndDate',
          dateFilter: true,
          isDate: true,
          width: 150,
        },
        {
          headerName: 'Double Beds',
          field: 'numDoubleBeds',
          numberFilter: true,
          width: 150,
        },
        {
          headerName: 'Single Beds',
          field: 'numSingleBeds',
          numberFilter: true,
          width: 150,
        },
        {
          headerName: 'Gender Pref.',
          field: 'genderPreference',
          genderPrefFilter: true,
          width: 150,
        },
        {
          headerName: 'Ride Prov.',
          field: 'providesRide',
          booleanFilter: true,
          width: 150,
        },
        {
          headerName: 'Has Pet',
          field: 'hasPet',
          booleanFilter: true,
          width: 150,
        },
        {
          headerName: 'Pet Desc.',
          field: 'petDescription',
          textFilter: true,
          width: 200,
        },
        {
          headerName: 'Hous. Comment',
          field: 'tempHousingComment',
          textFilter: true,
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
          isTimestamp: true,
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
            <Row className="mt-5 full-pretty-box-layout">
              <Col className="pretty-box">
                <h2 className="pretty-box-heading">Export Volunteers</h2>
                <Alert dismissible variant='info'>
                    This page displays all volunteers. Click any <b>Export</b> button to export volunteers.
                </Alert>
                <MultipleSortingInfo/>
                {serverError && (
                  <Alert variant='danger'>
                    {serverError}
                  </Alert>
                )}
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
                  noDefaultCellClass={true}
                />
              </Col>
            </Row>
          </Container>
        </div>
      );
  };

export default ExportVolunteersPage;
