import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import { Modal, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import VolunteerProfileForm from './VolunteerProfileForm';
import VolunteerPickupCapacityForm from './VolunteerPickupCapacityForm';
import VolunteerHousingCapacityForm from './VolunteerHousingCapacityForm';
import UserEditableAccountForm from './UserEditableAccountForm';
import * as formUtils from '../utils/formUtils';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';

const VolunteerDetailsModal = ({ value, node, readOnly, adminView }) => {
    const [showModal, setShowModal] = useState(false);
    const [serverError, setServerError] = useState('');
    const [currentTab, setCurrentTab] = useState('profile');
    const [loadedData, setLoadedData] = useState({});

    const userId = value;

    var studentProfile;
    var userAccount;
    var pickupCapacity;
    var housingCapacity;

    const studentProfileFormRef = useRef(null);
    const userAccountFormRef = useRef(null);
    const VolunteerPickupCapacityFormRef = useRef(null);
    const VolunteerHousingCapacityFormRef = useRef(null);

    const modalSize = 'lg';
  
    const handleClose = () => {
      setCurrentTab('profile');
      setShowModal(false);
    };

    const handleShow = () => {
      setCurrentTab('profile');
      setShowModal(true);
    };

    const handleTabSelect = (key) => {
      setCurrentTab(key);
    }

    useEffect(() => {
      const fetchVolunteerData = async () => {
        try {
          let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/getVolunteer/${userId}`);
          let volunteer = axiosResponse.data.result.volunteer;

          setLoadedData(volunteer);
        } catch (axiosError) {
          let { errorMessage } = parseAxiosError(axiosError);

          window.scrollTo(0, 0);
          setServerError(errorMessage);
        }
      };

      if(showModal)
      {
        fetchVolunteerData();
      }
    }, [showModal, userId]);

    const sendUpdateVolunteerProfileRequest = async () => {
      try {
        let preparedVolunteerProfile = formUtils.fromVolunteerProfileForm(studentProfile);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateProfile/${userId}`,
          {
            volunteerProfile: preparedVolunteerProfile,
          });

        setServerError('');

        alert('Volunteer profile updated successully!');

        node.setData({
          ...node.data,
          firstName: preparedVolunteerProfile.firstName,
          lastName: preparedVolunteerProfile.lastName,
          gender: magicDataGridUtils.toGenderValue(preparedVolunteerProfile.gender),
          emailAddress: preparedVolunteerProfile.emailAddress,
          primaryPhoneNumber: preparedVolunteerProfile.primaryPhoneNumber,
          secondaryPhoneNumber: preparedVolunteerProfile.secondaryPhoneNumber,
          userEnabled: magicDataGridUtils.toYesOrNoValue(preparedVolunteerProfile.enabled),
          modifiedAt: new Date(),
        });
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateUserAccountRequest = async () => {
      try {
        let preparedUserAccount = formUtils.fromUserAccountForm(userAccount);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/updateAccount/${userId}`,
          {
            userAccount: preparedUserAccount,
          });

        setServerError('');

        alert('User account updated successully!');
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateVolunteerAirportPickupRequest = async () => {
      try {
        let preparedVolunteerAirportPickup = formUtils.fromVolunteerAirportPickupForm(pickupCapacity);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateAirportPickup/${userId}`,
          {
            volunteerAirportPickup: preparedVolunteerAirportPickup,
          });
          
        setServerError('');

        alert('Volunteer airport pickup capacity updated successully!');

        node.setData({
          ...node.data,
          providesAirportPickup: magicDataGridUtils.toYesOrNoValue(preparedVolunteerAirportPickup.providesAirportPickup),
          modifiedAt: new Date(),
        });
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateVolunteerTempHousingRequest = async () => {
      try {
        let preparedVolunteerTempHousing = formUtils.fromVolunteerTempHousingForm(housingCapacity);
        
        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/updateTempHousing/${userId}`,
          {
            volunteerTempHousing: preparedVolunteerTempHousing,
          });

        setServerError('');

        alert('Volunteer temporary housing capacity updated successully!');

        node.setData({
          ...node.data,
          providesTempHousing: magicDataGridUtils.toYesOrNoValue(preparedVolunteerTempHousing.providesTempHousing),
          modifiedAt: new Date(),
        });
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const handleSubmit = () => {
      if (currentTab === 'profile')
      {
        studentProfileFormRef.current.submitForm().then(() => {
            const studentProfileErrors = studentProfileFormRef.current.errors;
        
            if (Object.keys(studentProfileErrors).length === 0)
            {
              sendUpdateVolunteerProfileRequest();
            }
        });
      }
      else if (currentTab === 'userAccount')
      {
        userAccountFormRef.current.submitForm().then(() => {
            const userAccountErrors = userAccountFormRef.current.errors;

            if (Object.keys(userAccountErrors).length === 0)
            {
              sendUpdateUserAccountRequest();
            }
        });
      }
      else if (currentTab === 'pickupCapacity')
      {
        VolunteerPickupCapacityFormRef.current.submitForm().then(() => {
            const VolunteerPickupCapacityFormErros = VolunteerPickupCapacityFormRef.current.errors;
        
            if (Object.keys(VolunteerPickupCapacityFormErros).length === 0)
            {
              sendUpdateVolunteerAirportPickupRequest();
            }
        });
      }
      else if (currentTab === 'housingCapacity')
      {
        VolunteerHousingCapacityFormRef.current.submitForm().then(() => {
            const VolunteerHousingCapacityFormErros = VolunteerHousingCapacityFormRef.current.errors;
        
            if (Object.keys(VolunteerHousingCapacityFormErros).length === 0)
            {
              sendUpdateVolunteerTempHousingRequest();
            }
        });
      }
    }

    const handleVolunteerProfileSubmit = (values, { setSubmitting }) => {
      studentProfile = values;
      setSubmitting(false);
    };

    const handleUserAccountSubmit = (values, { setSubmitting }) => {
      userAccount = values;
      setSubmitting(false);
    };
  
    const handleVolunteerPickupCapacityFormSubmit = (values, { setSubmitting }) => {
      pickupCapacity = values;
      setSubmitting(false);
    };
  
    const handleVolunteerHousingCapacityFormSubmit = (values, { setSubmitting }) => {
      housingCapacity = values;
      setSubmitting(false);
    };

    return (
      <>
        <div onClick={handleShow} className='hyperlink'>
          {value}
        </div>

        <Modal show={showModal} onHide={handleClose} centered size={modalSize}>
          <Modal.Header closeButton>
            <Modal.Title>Volunteer Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {serverError && (
                    <Alert variant='danger'>
                      {serverError}
                    </Alert>
                  )}
            <Tabs
              defaultActiveKey="profile"
              id="student-details-modal-tabs"
              className="mb-3"
              onSelect={handleTabSelect}
            >
              <Tab eventKey="profile" title="Volunteer Profile">
                <VolunteerProfileForm
                  innerRef={studentProfileFormRef}
                  onSubmit={handleVolunteerProfileSubmit}
                  adminView={adminView}
                  formReadOnly={readOnly}
                  loadedData={loadedData.volunteerProfile}
                />
              </Tab>
              { adminView ?
                <Tab eventKey="userAccount" title="User Account">
                  <UserEditableAccountForm
                    innerRef={userAccountFormRef}
                    onSubmit={handleUserAccountSubmit}
                    formReadOnly={readOnly}
                    loadedData={loadedData.userAccount}
                  />
                </Tab>
                : null
              }
              <Tab eventKey="pickupCapacity" title="Airport Pickup">
                <VolunteerPickupCapacityForm
                  innerRef={VolunteerPickupCapacityFormRef}
                  onSubmit={handleVolunteerPickupCapacityFormSubmit}
                  formReadOnly={readOnly}
                  loadedData={loadedData.volunteerAirportPickup}
                />
              </Tab>
              <Tab eventKey="housingCapacity" title="Temporary Housing">
                <VolunteerHousingCapacityForm
                  innerRef={VolunteerHousingCapacityFormRef}
                  onSubmit={handleVolunteerHousingCapacityFormSubmit}
                  formReadOnly={readOnly}
                  loadedData={loadedData.volunteerTempHousing}
                />
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
          { !readOnly ?
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            : null }
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

export default VolunteerDetailsModal;