import { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import AssignHostedByModal from '../components/AssignHostedByModal';
import VolunteerDetailsModal from '../components/VolunteerDetailsModal';
import QuickViewModal from '../components/QuickViewModal';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';

const ManageTempHousingStudentsPage = () => {
  const [serverError, setServerError] = useState('');
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);
  const [quickViewData, setQuickViewData] = useState({});

  const [tempHousingNeeds, setTempHousingNeeds] = useState([]);

  const gridRef = useRef();
  
  const fetchData = useCallback(async (referencesById) => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getTempHousingNeeds`);
      let fetchedStudents = axiosResponse.data.result.students;

      let formattedStudents = fetchedStudents.map(function(student) {

        let arrivalDatetime = student.studentFlightInfo.arrivalDatetime;

        let retRow = {
          studentUserId: student.userAccount.userId,
          lastName: student.studentProfile.lastName,
          firstName: student.studentProfile.firstName,
          gender: magicDataGridUtils.toGenderValue(student.studentProfile.gender),
          isNewStudent: magicDataGridUtils.toYesOrNoValue(student.studentProfile.isNewStudent),
          major: student.studentProfile.customMajor,
          arrivalAirline: student.studentFlightInfo.customArrivalAirline,
          arrivalDate: magicDataGridUtils.getDate(arrivalDatetime),
          arrivalTime: magicDataGridUtils.getTime(arrivalDatetime),
          arrivalFlightNumber: student.studentFlightInfo.arrivalFlightNumber,
          numNights: student.studentTempHousing.numNights,
          tempHousingVolunteer: student?.tempHousingAssignment?.volunteerUserId,
          modified: new Date(student.modifiedAt),
          lastLoginTime: null,

          // For quick view modal only
          wechatId: student.studentProfile.wechatId,
          emailAddress: student.studentProfile.emailAddress,
          cnPhoneNumber: student.studentProfile.cnPhoneNumber,
          usPhoneNumber: student.studentProfile.usPhoneNumber,
        }

        if(student.studentProfile.majorReferenceId !== null) {
          retRow.major = referencesById['Major'][student.studentProfile.majorReferenceId];
        }

        if(student.studentFlightInfo.arrivalAirlineReferenceId !== null) {
          retRow.arrivalAirline = referencesById['Airline'][student.studentFlightInfo.arrivalAirlineReferenceId];
        }

        if(student.lastLoginTime) {
          retRow.lastLoginTime = new Date(student.lastLoginTime);
        }

        return retRow
      });

      setTempHousingNeeds(formattedStudents);
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
          referenceTypes: ['Major', 'Airline'].join(','),
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

  // Fetch volunteer details when a student is selected with an API call
  // tempHousingVolunteer is just the volunteer's userId
  const handleRowDoubleClicked = useCallback(async (event) => {
    if(event.data) {
      let quickData = {
        'Title1': 'Student Info',
        'Student User ID': event.data.studentUserId,
        'Student Name': event.data.firstName + ' ' + event.data.lastName,
        'Student Wechat': event.data.wechatId,
        'Student Email': event.data.emailAddress,
        'Student US Phone': event.data.usPhoneNumber,
        'Student CN Phone': event.data.cnPhoneNumber,
      }

      if(event.data.arrivalAirline) {
        quickData['Arrival Flight Number'] = event.data.arrivalFlightNumber;

        //extract Date only
        quickData['Arrival Date'] = event.data.arrivalDate.toISOString().split("T")[0];
        let estimatedDepartureDate = new Date(event.data.arrivalDate);
        estimatedDepartureDate.setDate(estimatedDepartureDate.getDate() + event.data.numNights);
        quickData['Est. Departure Date'] = estimatedDepartureDate.toISOString().split("T")[0];
        quickData['Nights of Stay'] = event.data.numNights;
      } else {
        quickData['Arrival Flight Number'] = 'Not Provided';
        quickData['Arrival Date'] = 'Not Provided';
        quickData['Est. Departure Date'] = '(Arrival date missing, cannot decide)';
        quickData['Nights of Stay'] = event.data.numNights;
      }

      quickData['SEPARATOR'] = '';
      quickData['Title2'] = 'Volunteer Info';
      
      let tempHousingVolunteerUserId = event.data.tempHousingVolunteer;

      if (tempHousingVolunteerUserId) {
        // Fetch volunteer details using the volunteer ID
        await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getVolunteer/${tempHousingVolunteerUserId}`)
          .then((axiosResponse) => {
            let volunteer = axiosResponse.data.result.volunteer;

            let volunteerDetails = {
              'Volunteer User ID': volunteer.userAccount.userId,
              'Volunteer Name': volunteer.volunteerProfile.firstName + ' ' + volunteer.volunteerProfile.lastName,
              'Volunteer Email': volunteer.volunteerProfile.emailAddress,
              'Volunteer Phone': volunteer.volunteerProfile.primaryPhoneNumber,
              'Volunteer Home Address': volunteer.volunteerTempHousing.homeAddress,
            }

            setQuickViewData({
              ...quickData,
              ...volunteerDetails
            });

            setShowQuickViewModal(true);
          }
        ).catch((axiosError) => {
          let { errorMessage } = parseAxiosError(axiosError);
          window.scrollTo(0, 0);
          setServerError(errorMessage);
        });
      } else {
        setQuickViewData({
          ...quickData,
          'Temp Housing Volunteer': 'Not Assigned',
        });
        setShowQuickViewModal(true);
      }
    }
  }, []);

  const columns = [
    {
      headerName: 'Student Id',
      field: 'studentUserId',
      cellRenderer: AssignHostedByModal,
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
      width: 100,
    },
    {
      headerName: 'First Time',
      field: 'isNewStudent',
      booleanFilter: true,
      width: 100,
    },
    {
      headerName: 'Major',
      field: 'major',
      textFilter: true,
    },
    {
      headerName: 'Air',
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
      headerName: 'FN',
      field: 'arrivalFlightNumber',
      textFilter: true,
    },
    {
      headerName: 'Nights',
      field: 'numNights',
      width: 80,
    },
    {
      headerName: 'Assigned To',
      field: 'tempHousingVolunteer',
      cellRenderer: VolunteerDetailsModal,
      cellRendererParams: {
        readOnly: true,
        adminView: true,
      },
      textFilter: true,
      width: 120,
    },
    {
      headerName: 'Modified',
      field: 'modified',
      isTimestamp: true,
    },
    {
      headerName: 'Last Login',
      field: 'lastLoginTime',
      isTimestamp: true,
      sort: 'desc',
    },
  ];

  return (
    <div>
      <ApathNavbar />

      <Container className="mt-5" fluid>
        <h2 className="pretty-box-heading">Temporary Housing Student List</h2>
        <Alert dismissible variant='info'>
          This table below displays all students that request temporary housing.
        </Alert>
        <Alert dismissible variant='secondary'>
          <b>Click a student ID</b> to <b>assign</b> a housing volunteer to this student.<br/><br/>
          <b>Double click</b> a row to see a <b>quick view</b> of the student's temp housing request and be able to <b>copy/paste</b>.
        </Alert>
        <MultipleSortingInfo/>
        {serverError && (
          <Alert variant='danger'>
            {serverError}
          </Alert>
        )}
        <MagicDataGrid
          innerRef={gridRef}
          columnDefs={columns}
          rowData={tempHousingNeeds}
          pagination={true}
          onRowDoubleClicked={handleRowDoubleClicked}
        />
      </Container>

      <QuickViewModal
        title="Quick Temp Housing (Student View)"
        data={quickViewData}
        show={showQuickViewModal}
        onHide={() => setShowQuickViewModal(false)}
      />
    </div>
  );
};

export default ManageTempHousingStudentsPage;