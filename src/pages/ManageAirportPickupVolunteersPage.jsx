import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import ApathNavbar from '../components/ApathNavbar';
import { Container, Alert } from 'react-bootstrap';
import MagicDataGrid from '../components/MagicDataGrid';
import MultipleSortingInfo from '../components/MultipleSortingInfo';
import AssignPickupStudentsModal from '../components/AssignPickupStudentsModal';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';

const ManageAirportPickupVolunteersPage = () => {
  const [serverError, setServerError] = useState('');

  const [volunteerData, setVolunteerData] = useState([]);

  const gridRef = useRef();

  const fetchData = useCallback(async() => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getVolunteers`, {
        params: {
          providesAirportPickup: true,
          includeAirportPickupAssignments: true,
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
          gender: magicDataGridUtils.toGenderValue(volunteer.volunteerProfile.gender),
          airportPickupStudents: volunteer?.airportPickupAssignments?.map(assignment => assignment.studentUserId),
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
      cellRenderer: AssignPickupStudentsModal,
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
      headerName: 'Assigned Students',
      field: 'airportPickupStudents',
      cellRenderer: AssignPickupStudentsModal,
      cellRendererParams: {
        viewAssigned: true,
      },
      textFilter: true,
      isArray: true,
    },
    {
      headerName: 'Modified',
      field: 'modified',
      isTimestamp: true,
    },
  ];

  return (
    <div>
      <ApathNavbar />

      <Container className="mt-5" fluid>
        <h2 className="pretty-box-heading">Airport Pickup Volunteer List</h2>
        <Alert dismissible variant='info'>
          This table below displays all volunteers that provide pickup.
        </Alert>
        <Alert dismissible variant='secondary'>
          Click a volunteer ID to assign pickup task(s) this volunteer.
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
        />
      </Container>
    </div>
  );
};

export default ManageAirportPickupVolunteersPage;