import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';import ApathNavbar from '../components/ApathNavbar';
import { Container, Alert, Button } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import XLSX from 'sheetjs-style';
import Papa from "papaparse";
import * as magicDataGridUtils from '../utils/magicDataGridUtils';


const ExportStudentsPage = () => {
  const [serverError, setServerError] = useState('');

  const [studentData, setStudentData] = useState([]);

  const gridRef = useRef();

  const fetchData = useCallback(async (referencesById) => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getStudents`, {
        params: {
          needsHousing: true,
          includeAirportPickupAssignment: true,
          includeTempHousingAssignment: true,
        }
      });

      let fetchedStudents = axiosResponse.data.result.students;

      let formattedStudents = fetchedStudents.map(function(student) {

        let retRow = {
          studentUserId: student.userAccount.userId,
          lastName: student.studentProfile.lastName,
          firstName: student.studentProfile.firstName,
          emailAddress: student.studentProfile.emailAddress,
          gender: magicDataGridUtils.toGenderValue(student.studentProfile.gender),
          isNewStudent: magicDataGridUtils.toYesOrNoValue(student.studentProfile.isNewStudent),
          studentType: student.studentProfile.studentType,
          graduatesFrom: student.studentProfile.graduatesFrom,
          major: student.studentProfile.customMajor,
          hasCompanion: magicDataGridUtils.toYesOrNoValue(student.studentProfile.hasCompanion),
          wechatId: student.studentProfile.wechatId,
          cnPhoneNumber: student.studentProfile.cnPhoneNumber,
          usPhoneNumber: student.studentProfile.usPhoneNumber,
          attendsWeekOfWelcome: magicDataGridUtils.toYesOrNoValue(student.studentProfile.attendsWeekOfWelcome),
          needsAirportPickup: magicDataGridUtils.toYesOrNoValue(student.studentFlightInfo.needsAirportPickup),
          arrivalAirline: null,
          arrivalDate: null,
          arrivalTime: null,
          arrivalFlightNumber: null,
          departureAirline: null,
          departureDate: null,
          departureTime: null,
          departureFlightNumber: null,
          numLgLuggages: null,
          numSmLuggages: null,
          needsTempHousing: magicDataGridUtils.toYesOrNoValue(student.studentTempHousing.needsTempHousing),
          numNights: null,
          destinationAddress: null,
          contactName: null,
          contactPhoneNumber: null,
          contactEmailAddress: null,
          studentComment: student.studentComment.studentComment,
          adminComment: student.studentComment.adminComment,
          airportPickupVolunteer: student?.airportPickupAssignment?.volunteerUserId,
          tempHousingVolunteer: student?.tempHousingAssignment?.volunteerUserId,
          modified: new Date(student.modifiedAt),
        }

        if(student.studentProfile.majorReferenceId !== null) {
          retRow.major = referencesById['Major'][student.studentProfile.majorReferenceId];
        }

        if(student.studentFlightInfo.needsAirportPickup && student.studentFlightInfo.hasFlightInfo)
        {
          let arrivalDatetime = student.studentFlightInfo.arrivalDatetime;
          let departureDatetime = student.studentFlightInfo.departureDatetime;

          retRow.arrivalDate = magicDataGridUtils.getDate(arrivalDatetime);
          retRow.arrivalTime = magicDataGridUtils.getTime(arrivalDatetime);
          retRow.arrivalFlightNumber = student.studentFlightInfo.arrivalFlightNumber;
          retRow.arrivalAirline = student.studentFlightInfo.customArrivalAirline;
          if(student.studentFlightInfo.arrivalAirlineReferenceId !== null) {
            retRow.arrivalAirline = referencesById['Airline'][student.studentFlightInfo.arrivalAirlineReferenceId];
          }

          retRow.departureDate = magicDataGridUtils.getDate(departureDatetime);
          retRow.departureTime = magicDataGridUtils.getTime(departureDatetime);
          retRow.departureFlightNumber = student.studentFlightInfo.departureFlightNumber;
          retRow.departureAirline = student.studentFlightInfo.customDepartureAirline;
          if(student.studentFlightInfo.departureAirlineReferenceId !== null) {
            retRow.departureAirline = referencesById['Airline'][student.studentFlightInfo.departureAirlineReferenceId];
          }

          retRow.numLgLuggages = student.studentFlightInfo.numLgLuggages;
          retRow.numSmLuggages = student.studentFlightInfo.numSmLuggages;
        }

        retRow.destinationAddress = student.studentTempHousing.customDestinationAddress;

        if(student.studentTempHousing.apartmentReferenceId !== null) {
          retRow.destinationAddress = referencesById['Apartment'][student.studentTempHousing.apartmentReferenceId];
        }

        if(student.studentTempHousing.needsTempHousing)
        {
          retRow.numNights = student.studentTempHousing.numNights;
        }
        else
        {
          retRow.contactName = student.studentTempHousing.contactName;
          retRow.contactPhoneNumber = student.studentTempHousing.contactPhoneNumber;
          retRow.contactEmailAddress = student.studentTempHousing.contactEmailAddress;
        }

        return retRow
      });

      setStudentData(formattedStudents);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
        params: {
          referenceTypes: ['Major', 'Airline', 'Apartment'].join(','),
        }
      });

      let referencesById = {};

      let referencesByType = axiosResponse.data.result.referencesByType;

      for (let referenceType in referencesByType) {
        let referenceList = referencesByType[referenceType];

        let referenceMap = {};

        for (let reference of referenceList) {
          referenceMap[reference.referenceId] = reference.value;
        }

        referencesById[referenceType] = referenceMap;
      }

      fetchData(referencesById);
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      setServerError(errorMessage);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);
    
      const columns = [
        {
          headerName: 'Student Id',
          field: 'studentUserId',
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
          headerName: 'Email',
          field: 'emailAddress',
          textFilter: true,
          width: 200,
        },
        {
          headerName: 'Gender',
          field: 'gender',
          genderFilter: true,
        },
        {
          headerName: 'First Time',
          field: 'isNewStudent',
          booleanFilter: true,
        },
        {
          headerName: 'Type',
          field: 'studentType',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Grad. From',
          field: 'graduatesFrom',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Major',
          field: 'major',
          textFilter: true,
        },
        {
          headerName: 'Has Comp.',
          field: 'hasCompanion',
          booleanFilter: true,
          width: 120,
        },
        {
          headerName: 'Wechat',
          field: 'wechatId',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'CN Phone',
          field: 'cnPhoneNumber',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'US Phone',
          field: 'usPhoneNumber',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Pk. Req',
          field: 'needsAirportPickup',
          booleanFilter: true,
          width: 120,
        },
        {
          headerName: 'Dep FN',
          field: 'departureFlightNumber',
          textFilter: true,
          width: 120,
        },
        {
          headerName: 'Dep AirL',
          field: 'departureAirline',
          textFilter: true,
        },
        {
          headerName: 'Dep Date',
          field: 'departureDate',
          dateFilter: true,
          isDate: true,
        },
        {
          headerName: 'Dep Time',
          field: 'departureTime',
          width: 100,
        },
        {
            headerName: 'Arri FN',
            field: 'arrivalFlightNumber',
            textFilter: true,
            width: 120,
        },
        {
          headerName: 'Arri AirL',
          field: 'arrivalAirline',
          textFilter: true,
        },
        {
          headerName: 'Arr Date',
          field: 'arrivalDate',
          dateFilter: true,
          isDate: true,
        },
        {
          headerName: 'Arr Time',
          field: 'arrivalTime',
          width: 100,
        },
        {
          headerName: 'Lg Lugg.',
          field: 'numLgLuggages',
          numberFilter: true,
          width: 120,
        },
        {
          headerName: 'Sm Lugg.',
          field: 'numSmLuggages',
          numberFilter: true,
          width: 120,
        },
        {
          headerName: 'Hous. Req',
          field: 'needsTempHousing',
          booleanFilter: true,
          width: 120,
        },
        {
          headerName: 'Nights',
          field: 'numNights',
          numberFilter: true,
          width: 120,
        },
        {
          headerName: 'Dest. Addr.',
          field: 'destinationAddress',
          textFilter: true,
          width: 300,
        },
        {
          headerName: 'Cont. Name',
          field: 'contactName',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Cont. Phone',
          field: 'contactPhoneNumber',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Cont. Email',
          field: 'contactEmailAddress',
          textFilter: true,
          width: 150,
        },
        {
          headerName: 'Stud. Comment',
          field: 'studentComment',
          width: 200,
          textFilter: true,
        },
        {
          headerName: 'Admin Comment',
          field: 'adminComment',
          width: 200,
          textFilter: true,
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
          isTimestamp: true,
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
            <h2 className="pretty-box-heading">Export Students</h2>
            <Alert dismissible variant='info'>
                This page displays all students. Click any <b>Export</b> button to export students.
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
              columnDefs={columns}
              rowData={studentData}
              pagination={true}
              noDefaultCellClass={true}
            />
          </Container>
        </div>
      );
  };

export default ExportStudentsPage;
