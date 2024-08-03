import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import { Modal, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import StudentProfileForm from './StudentProfileForm';
import StudentFlightInfoForm from './StudentFlightInfoForm';
import StudentTempHousingForm from './StudentTempHousingForm';
import StudentCommentForm from './StudentCommentForm';
import UserEditableAccountForm from './UserEditableAccountForm';
import * as formUtils from '../utils/formUtils';
import * as magicDataGridUtils from '../utils/magicDataGridUtils';



const StudentDetailsModal = ({ value, node, readOnly, adminView, optionReferences }) => {
    const [showModal, setShowModal] = useState(false);
    const [serverError, setServerError] = useState('');
    const [currentTab, setCurrentTab] = useState('profile');
    const [loadedData, setLoadedData] = useState({});
    const [managementData, setManagementData] = useState({});
    const [airportPickupAssigned, setAirportPickupAssigned] = useState(false);
    const [tempHousingAssigned, setTempHousingAssigned] = useState(false);

    const userId = value;

    var studentProfile;
    var userAccount;
    var flightInfo;
    var tempHousing;
    var studentComment;

    const studentProfileFormRef = useRef(null);
    const userAccountFormRef = useRef(null);

    const studentFlightInfoFormRef = useRef(null);
    const studentTempHousingFormRef = useRef(null);
    const studentCommentFormRef = useRef(null);

    const modalSize = adminView ? 'lg' : 'md';
  
    const handleClose = () => {
      setCurrentTab('profile');
      setShowModal(false);
    };

    const handleShow = () => {
      setCurrentTab('profile');
      setShowModal(true);
    };

    const handleTabSelect = (key) => {
      if(readOnly || !getTabFormDirty(currentTab))
        {
          setCurrentTab(key);
        }
        else
        {
          let userConfirmed = window.confirm('Each tab form needs to be submitted separately. Are you sure you want to switch tabs?');

          if (userConfirmed) {
            setCurrentTab(key);
          }
        }
    }

    const getTabFormDirty = (key) => {
      if( !studentCommentFormRef
        || !studentProfileFormRef
        || !userAccountFormRef
        || !studentFlightInfoFormRef
        || !studentTempHousingFormRef
        || !studentCommentFormRef.current
        || !studentProfileFormRef.current
        || !userAccountFormRef.current
        || !studentFlightInfoFormRef.current
        || !studentTempHousingFormRef.current)
        
      {
        return false;
      }

      if (key === 'profile')
      {
        return studentProfileFormRef.current.dirty;
      }
      else if (key === 'userAccount')
      {
        return userAccountFormRef.current.dirty;
      }
      else if (key === 'flightInfo')
      {
        return studentFlightInfoFormRef.current.dirty;
      }
      else if (key === 'tempHousing')
      {
        return studentTempHousingFormRef.current.dirty;
      }
      else if (key === 'comment')
      {
        return studentCommentFormRef.current.dirty;
      }

      return false;
    }
    
    useEffect(() => {
      const fetchStudentData = async () => {
        try {
          let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getStudent/${userId}`);
          let student = axiosResponse.data.result.student;

          setLoadedData(student);

          if( adminView )
          {
            checkAirportPickupAssignment();
          }
          else
          {
            fetchManagementData();
          }
        } catch (axiosError) {
          let { errorMessage } = parseAxiosError(axiosError);

          window.scrollTo(0, 0);
          setServerError(errorMessage);
        }
      };

      const checkAirportPickupAssignment = async () => {
        try{
          let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getAirportPickupAssignment/${userId}`);
          let fetchedAirportPickupAssignment = axiosResponse.data.result.student.airportPickupAssignment;
          let assignedVolunteer = fetchedAirportPickupAssignment?.volunteer;
  
          if(assignedVolunteer !== undefined && assignedVolunteer !== null) {
            setAirportPickupAssigned(true);
          }

          checkTempHousingAssignment();
        } catch (axiosError) {
          let { errorMessage } = parseAxiosError(axiosError);
    
          window.scrollTo(0, 0);
          setServerError(errorMessage);
        }
      }

      const checkTempHousingAssignment = async () => {
        try{
          let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getTempHousingAssignment/${userId}`);
          let fetchedTempHousingAssignment = axiosResponse.data.result.student.tempHousingAssignment;
          let assignedVolunteer = fetchedTempHousingAssignment?.volunteer;
  
          if(assignedVolunteer !== undefined && assignedVolunteer !== null) {
            setTempHousingAssigned(true);
          }

          fetchManagementData();
        } catch (axiosError) {
          let { errorMessage } = parseAxiosError(axiosError);
    
          window.scrollTo(0, 0);
          setServerError(errorMessage);
        }
      }

      const fetchManagementData = async () => {
        try {
          let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getManagement`);
    
          let managent = axiosResponse?.data?.result?.management;
  
          setManagementData(managent);
        }
        catch (axiosError) {
          let { errorMessage } = parseAxiosError(axiosError);
    
          setServerError(errorMessage);
        }
      }

      if(showModal)
      {
        fetchStudentData();
      }
    }, [showModal, userId]);
    
    const sendUpdateStudentProfileRequest = async (setSubmitting) => {
      try {
        let preparedStudentProfile = formUtils.fromStudentProfileForm(studentProfile);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateProfile/${userId}`,
          {
            studentProfile: preparedStudentProfile,
          });

        setServerError('');

        alert('Student Profile updated successully!');

        node.setData({
          ...node.data,
          firstName: preparedStudentProfile.firstName,
          lastName: preparedStudentProfile.lastName,
          gender: magicDataGridUtils.toGenderValue(preparedStudentProfile.gender),
          modifiedAt: new Date(),
        });

        setSubmitting(false);

        studentProfileFormRef.current.resetForm({values: studentProfile});
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateUserAccountRequest = async (setSubmitting) => {
      try {
        let preparedUserAccount = formUtils.fromUserAccountForm(userAccount);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/updateAccount/${userId}`,
          {
            userAccount: preparedUserAccount,
          });

        setServerError('');

        alert('User account updated successully!');

        setSubmitting(false);

        userAccountFormRef.current.resetForm({values: userAccount});
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateStudentFlightInfoRequest = async (setSubmitting) => {
      try {
        let preparedFlightInfo = formUtils.fromStudentFlightInfoForm(flightInfo);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateFlightInfo/${userId}`,
          {
            studentFlightInfo: preparedFlightInfo,
          });

        setServerError('');

        alert('Student Flight Info updated successully!');

        setSubmitting(false);

        studentFlightInfoFormRef.current.resetForm({values: flightInfo});

        if(preparedFlightInfo.needsAirportPickup && preparedFlightInfo.hasFlightInfo)
        {
          let arrivalDatetime = preparedFlightInfo.arrivalDatetime;

          node.setData({
            ...node.data,
            needsAirportPickup: magicDataGridUtils.toYesOrNoValue(preparedFlightInfo.needsAirportPickup),
            arrivalDate: magicDataGridUtils.getDate(arrivalDatetime),
            arrivalTime: magicDataGridUtils.getTime(arrivalDatetime),
            arrivalFlightNumber: preparedFlightInfo.arrivalFlightNumber,
            numLgLuggages: preparedFlightInfo.numLgLuggages,
            modifiedAt: new Date(),
          });
        }
        else
        {
          node.setData({
            ...node.data,
            needsAirportPickup: magicDataGridUtils.toYesOrNoValue(preparedFlightInfo.needsAirportPickup),
            arrivalDate: null,
            arrivalTime: null,
            arrivalFlightNumber: null,
            numLgLuggages: null,
            modifiedAt: new Date(),
          });
        }
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateStudentTempHousingRequest = async (setSubmitting) => {
      try {
        let preparedTempHousing = formUtils.fromStudentTempHousingForm(tempHousing);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateTempHousing/${userId}`,
          {
            studentTempHousing: preparedTempHousing,
          });

        setServerError('');

        alert('Student Temp Housing updated successully!');

        setSubmitting(false);

        studentTempHousingFormRef.current.resetForm({values: tempHousing});

        node.setData({
          ...node.data,
          needsTempHousing: magicDataGridUtils.toYesOrNoValue(preparedTempHousing.needsTempHousing),
          modifiedAt: new Date(),
        });
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateStudentCommentRequest = async (setSubmitting) => {
      try {
        let preparedStudentComment = formUtils.fromStudentCommentForm(studentComment);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateComment/${userId}`,
          {
            studentComment: preparedStudentComment,
          });

        setServerError('');

        alert('Student Comment updated successully!');

        setSubmitting(false);

        studentCommentFormRef.current.resetForm({values: studentComment});
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const handleSubmit = () => {
      if (currentTab === 'profile')
      {
        studentProfileFormRef.current.submitForm();
      }
      else if (currentTab === 'userAccount')
      {
        userAccountFormRef.current.submitForm();
      }
      else if (currentTab === 'flightInfo')
      {
        studentFlightInfoFormRef.current.submitForm();
      }
      else if (currentTab === 'tempHousing')
      {
        studentTempHousingFormRef.current.submitForm();
      }
      else if (currentTab === 'comment')
      {
        studentCommentFormRef.current.submitForm();
      }
    }

    const handleStudentProfileSubmit = (values, { setSubmitting }) => {
      studentProfile = values;

      const studentProfileErrors = studentProfileFormRef.current.errors;
        
      if (Object.keys(studentProfileErrors).length === 0)
      {
        sendUpdateStudentProfileRequest(setSubmitting);
      }
    };

    const handleUserAccountSubmit = (values, { setSubmitting }) => {
      userAccount = values;

      let userAccountErrors = userAccountFormRef.current.errors;

      if (Object.keys(userAccountErrors).length === 0)
      {
        sendUpdateUserAccountRequest(setSubmitting);
      }
    };
  
    const handleStudentFlightInfoFormSubmit = (values, { setSubmitting }) => {
      flightInfo = values;

      const StudentFlightInfoFormErros = studentFlightInfoFormRef.current.errors;
        
      if (Object.keys(StudentFlightInfoFormErros).length === 0)
      {
        sendUpdateStudentFlightInfoRequest(setSubmitting);
      }
    };
  
    const handleStudentTempHousingFormSubmit = (values, { setSubmitting }) => {
      tempHousing = values;

      const StudentTempHousingFormErros = studentTempHousingFormRef.current.errors;
        
      if (Object.keys(StudentTempHousingFormErros).length === 0)
      {
        sendUpdateStudentTempHousingRequest(setSubmitting);
      }
    };

    const handleStudentCommentFormSubmit = (values, { setSubmitting }) => {
      studentComment = values;

      const studentCommentFormErros = studentCommentFormRef.current.errors;
        
      if (Object.keys(studentCommentFormErros).length === 0)
      {
        sendUpdateStudentCommentRequest(setSubmitting);
      }
    };

    return (
      <>
        <div onClick={handleShow} className='hyperlink'>
          {userId}
        </div>

        <Modal show={showModal} onHide={handleClose} centered size={modalSize}>
          <Modal.Header closeButton>
            <Modal.Title>Student Details</Modal.Title>
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
              activeKey={currentTab}
            >
              <Tab eventKey="profile" title="Student Profile">
                <StudentProfileForm
                  innerRef={studentProfileFormRef}
                  onSubmit={handleStudentProfileSubmit}
                  formReadOnly={readOnly}
                  optionReferences={optionReferences}
                  loadedData={loadedData.studentProfile}
                  managementData={managementData}
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
              <Tab eventKey="flightInfo" title="Airport Pickup">
                {airportPickupAssigned && adminView && (
                  <Alert variant='warning'>
                    This student has already been assigned an airport pickup volunteer. Please keep the volunteer informed of any changes.
                  </Alert>
                )}
                <StudentFlightInfoForm
                  innerRef={studentFlightInfoFormRef}
                  onSubmit={handleStudentFlightInfoFormSubmit}
                  formReadOnly={readOnly}
                  optionReferences={optionReferences}
                  loadedData={loadedData.studentFlightInfo}
                />
              </Tab>
              <Tab eventKey="tempHousing" title="Temporary Housing">
                {tempHousingAssigned && adminView && (
                  <Alert variant='warning'>
                    This student has already been assigned a temporary housing volunteer. Please keep the volunteer informed of any changes.
                  </Alert>
                )}
                <StudentTempHousingForm
                  innerRef={studentTempHousingFormRef}
                  onSubmit={handleStudentTempHousingFormSubmit}
                  formReadOnly={readOnly}
                  optionReferences={optionReferences}
                  loadedData={loadedData.studentTempHousing}
                />
              </Tab>
              { adminView ?
                <Tab eventKey="comment" title="Comment">
                  <StudentCommentForm
                    innerRef={studentCommentFormRef}
                    onSubmit={handleStudentCommentFormSubmit}
                    formReadOnly={readOnly}
                    adminView={true}
                    loadedData={loadedData.studentComment}
                  />
                </Tab>
              : null }
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

export default StudentDetailsModal;