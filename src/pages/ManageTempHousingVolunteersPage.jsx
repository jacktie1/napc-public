import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import AssignHostStudentsModal from '../components/AssignHostStudentsModal';
import QuickViewModal from '../components/QuickViewModal';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';

const ManageTempHousingStudentsPage = () => {
  const [serverError, setServerError] = useState('');
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);
  const [quickViewData, setQuickViewData] = useState({});

  const [volunteerData, setVolunteerData] = useState([]);

  const gridRef = useRef();

  const fetchData = useCallback(async() => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getVolunteers`, {
        params: {
          providesTempHousing: true,
          includeTempHousingAssignments: true,
          excludeDisabled: true,
        }
      });

      let fetchedVolunteers = axiosResponse.data.result.volunteers;

      let formattedVolunteers = fetchedVolunteers.map(function(volunteer) {
        let retRow = {
          volunteerUserId: volunteer.userAccount.userId,
          lastName: volunteer.volunteerProfile.lastName,
          firstName: volunteer.volunteerProfile.firstName,
          emailAddress: volunteer.volunteerProfile.emailAddress,
          primaryPhoneNumber: volunteer.volunteerProfile.primaryPhoneNumber,
          homeAddress: volunteer.volunteerTempHousing.homeAddress,
          gender: magicDataGridUtils.toGenderValue(volunteer.volunteerProfile.gender),
          tempHousingStudents: volunteer?.tempHousingAssignments?.map(assignment => assignment.studentUserId),
          modified: new Date(volunteer.modifiedAt),

          // For quick view modal
          tempHousingStartDate: magicDataGridUtils.getDate(volunteer.volunteerTempHousing.tempHousingStartDate),
          tempHousingEndDate: magicDataGridUtils.getDate(volunteer.volunteerTempHousing.tempHousingEndDate),
        }

        if(volunteer.lastLoginTime)
        {
          retRow.lastLoginTime = new Date(volunteer.lastLoginTime);
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

  const handleRowDoubleClicked = useCallback((event) => {
    let quickData = {};

    if(event.data)
    {
        quickData['Title1'] = 'Volunteer Info';
        quickData['Volunteer ID'] = event.data.volunteerUserId;
        quickData['Volunteer Name'] = `${event.data.firstName} ${event.data.lastName}`;
        quickData['Volunteer Email'] = event.data.emailAddress;
        quickData['Volunteer Phone'] = event.data.primaryPhoneNumber;
        quickData['Volunteer Home Address'] = event.data.homeAddress;

        let tempHousingStartDate = null;
        let tempHousingEndDate = null;

        if(event.data.tempHousingStartDate)
        {
          tempHousingStartDate = event.data.tempHousingStartDate.toISOString().split('T')[0];
        }

        if(event.data.tempHousingEndDate)
        {
          tempHousingEndDate = event.data.tempHousingEndDate.toISOString().split('T')[0];
        }
        
        if(tempHousingStartDate && tempHousingEndDate)
        {
          quickData['Temp Housing Availability'] = `${tempHousingStartDate} - ${tempHousingEndDate}`;
        }
        else if(tempHousingStartDate)
        {
          quickData['Temp Housing Availability'] = `${tempHousingStartDate} - (not specified)`;
        }
        else if(tempHousingEndDate)
        {
          quickData['Temp Housing Availability'] = `(not specified) - ${tempHousingEndDate}`;
        }
        else
        {
          quickData['Temp Housing Availability'] = '(not specified)';
        }


        setQuickViewData(quickData);
        setShowQuickViewModal(true);
    }
  }, []);

  const columns = [
    {
      headerName: 'Volunteer Id',
      field: 'volunteerUserId',
      cellRenderer: AssignHostStudentsModal,
      textFilter: true,
      width: 120,
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
      width: 100,
    },
    {
      headerName: 'Email',
      field: 'emailAddress',
      textFilter: true,
      minWidth: 200,
    },
    {
      headerName: 'Phone No',
      field: 'primaryPhoneNumber',
      textFilter: true,
      width: 150,
    },
    {
      headerName: 'Address',
      field: 'homeAddress',
      textFilter: true,
      minWidth: 350,
    },
    {
      headerName: 'Assigned',
      field: 'tempHousingStudents',
      cellRenderer: AssignHostStudentsModal,
      cellRendererParams: {
        viewAssigned: true,
      },
      isArray: true,
      textFilter: true,
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
        <h2 className="pretty-box-heading">Temporary Housing Volunteer List</h2>
        <Alert dismissible variant='info'>
          This table below displays all volunteers that provide temporary housing.
        </Alert>
        <Alert dismissible variant='secondary'>
          <b>Click a volunteer ID</b> to <b>assign</b> temporary housing task(s) this volunteer. <br/><br/>
          <b>Double click</b> a row to see a <b>quick view</b> of the volunteer's temp housing information and be able to <b>copy/paste</b>.
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
          rowData={volunteerData}
          pagination={true}
          onRowDoubleClicked={handleRowDoubleClicked}
        />
      </Container>

      <QuickViewModal
        title="Quick Temp Housing (Volunteer View)"
        data={quickViewData}
        show={showQuickViewModal}
        onHide={() => setShowQuickViewModal(false)}
      />
    </div>
  );
};

export default ManageTempHousingStudentsPage;