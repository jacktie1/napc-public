import React, { useState, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import { Modal, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import StudentProfileForm from './StudentProfileForm';
import StudentFlightInfoForm from './StudentFlightInfoForm';
import StudentTempHousingForm from './StudentTempHousingForm';
import StudentCommentForm from './StudentCommentForm';
import UserEditableAccountForm from './UserEditableAccountForm';
import * as formUtils from '../utils/formUtils';
import * as magicGridUtils from '../utils/magicGridUtils';


const StudentDetailsModal = ({ value, node, readOnly, adminView, optionReferences, loadedData }) => {
    const [showModal, setShowModal] = useState(false);
    const [serverError, setServerError] = useState('');
    const [currentTab, setCurrentTab] = useState('profile');

    const userId = value;

    var studentProfile;
    var userAccount;
    var flightInfo;
    var tempHousing;
    var studentComment;

    const studentProfileFormRef = useRef(null);
    const userAccountFormRef = useRef(null);

    const StudentFlightInfoFormRef = useRef(null);
    const StudentTempHousingFormRef = useRef(null);
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
      setCurrentTab(key);
    }
    
    const sendUpdateStudentProfileRequest = async () => {
      try {
        let preparedStudentProfile = formUtils.fromStudentProfileForm(studentProfile);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateProfile/${userId}`,
          {
            studentProfile: preparedStudentProfile,
          });

        node.updateData(
          {
            ...node.data,
            firstName: preparedStudentProfile.firstName,
            lastName: preparedStudentProfile.lastName,
            gender: magicGridUtils.toGenderValue(preparedStudentProfile.gender),
            modifiedAt: new Date(),
          });

        loadedData[userId].studentProfile = preparedStudentProfile;

        setServerError('');

        alert('Student Profile updated successully!');
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

        loadedData[userId].userAccount = {
          'username': preparedUserAccount.username,
          'password': '',
          'confirmPassword': '',
        };

        setServerError('');

        alert('User account updated successully!');
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateStudentFlightInfoRequest = async () => {
      try {
        let preparedFlightInfo = formUtils.fromStudentFlightInfoForm(flightInfo);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateFlightInfo/${userId}`,
          {
            studentFlightInfo: preparedFlightInfo,
          });

        let newArrivalDate = null;
        let newArrivalTime = null;
        let newArrivalFlightNumber = null;
        let newNumLgLuggages = null;

        if(preparedFlightInfo.needsAirportPickup && preparedFlightInfo.hasFlightInfo)
        {
          let arrivalDatetime = preparedFlightInfo.arrivalDatetime;

          newArrivalDate = magicGridUtils.getDate(arrivalDatetime);
          newArrivalTime = magicGridUtils.getTime(arrivalDatetime);
          newArrivalFlightNumber = preparedFlightInfo.arrivalFlightNumber;
          newNumLgLuggages = preparedFlightInfo.numLgLuggages;
        }

        node.updateData(
          {
            ...node.data,
            needsAirportPickup: magicGridUtils.toYesOrNoValue(preparedFlightInfo.needsAirportPickup),
            arrivalDate: newArrivalDate,
            arrivalTime: newArrivalTime,
            arrivalFlightNumber: newArrivalFlightNumber,
            numLgLuggages: newNumLgLuggages,
            modifiedAt: new Date(),
          });

        loadedData[userId].studentFlightInfo = preparedFlightInfo;

        setServerError('');

        alert('Student Flight Info updated successully!');

      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateStudentTempHousingRequest = async () => {
      try {
        let preparedTempHousing = formUtils.fromStudentTempHousingForm(tempHousing);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateTempHousing/${userId}`,
          {
            studentTempHousing: preparedTempHousing,
          });

        node.updateData(
          {
            ...node.data,
            needsTempHousing: magicGridUtils.toYesOrNoValue(preparedTempHousing.needsTempHousing),
            modifiedAt: new Date(),
          });

        loadedData[userId].studentTempHousing = preparedTempHousing;

        setServerError('');

        alert('Student Temp Housing updated successully!');
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    };

    const sendUpdateStudentCommentRequest = async () => {
      try {
        let preparedStudentComment = formUtils.fromStudentCommentForm(studentComment);

        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateComment/${userId}`,
          {
            studentComment: preparedStudentComment,
          });

        loadedData[userId].studentComment = preparedStudentComment;

        setServerError('');

        alert('Student Comment updated successully!');
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
              sendUpdateStudentProfileRequest();
            }
        });
      }
      else if (currentTab === 'userAccount')
      {
        userAccountFormRef.current.submitForm().then(() => {
          let userAccountErrors = userAccountFormRef.current.errors;

          if (Object.keys(userAccountErrors).length === 0)
          {
            sendUpdateUserAccountRequest();
          }
        });
      }
      else if (currentTab === 'flightInfo')
      {
        StudentFlightInfoFormRef.current.submitForm().then(() => {
            const StudentFlightInfoFormErros = StudentFlightInfoFormRef.current.errors;
        
            if (Object.keys(StudentFlightInfoFormErros).length === 0)
            {
              sendUpdateStudentFlightInfoRequest();
            }
        });
      }
      else if (currentTab === 'tempHousing')
      {
        StudentTempHousingFormRef.current.submitForm().then(() => {
            const StudentTempHousingFormErros = StudentTempHousingFormRef.current.errors;
        
            if (Object.keys(StudentTempHousingFormErros).length === 0)
            {
              sendUpdateStudentTempHousingRequest();
            }
        });
      }
      else if (currentTab === 'comment')
      {
        studentCommentFormRef.current.submitForm().then(() => {
            const studentCommentFormErros = studentCommentFormRef.current.errors;
        
            if (Object.keys(studentCommentFormErros).length === 0)
            {
              sendUpdateStudentCommentRequest();
            }
        });
      }
    }

    const handleStudentProfileSubmit = (values, { setSubmitting }) => {
      studentProfile = values;
      setSubmitting(false);
    };

    const handleUserAccountSubmit = (values, { setSubmitting }) => {
      userAccount = values;
      setSubmitting(false);
    };
  
    const handleStudentFlightInfoFormSubmit = (values, { setSubmitting }) => {
      flightInfo = values;
      setSubmitting(false);
    };
  
    const handleStudentTempHousingFormSubmit = (values, { setSubmitting }) => {
      tempHousing = values;
      setSubmitting(false);
    };

    const handleStudentCommentFormSubmit = (values, { setSubmitting }) => {
      studentComment = values;
      setSubmitting(false);
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
            >
              <Tab eventKey="profile" title="Student Profile">
                <StudentProfileForm
                  innerRef={studentProfileFormRef}
                  onSubmit={handleStudentProfileSubmit}
                  formReadOnly={readOnly}
                  optionReferences={optionReferences}
                  loadedData={loadedData[userId].studentProfile}
                />
              </Tab>
              <Tab eventKey="userAccount" title="User Account">
                <UserEditableAccountForm
                  innerRef={userAccountFormRef}
                  onSubmit={handleUserAccountSubmit}
                  formReadOnly={readOnly}
                  loadedData={loadedData[userId].userAccount}
                />
              </Tab>
              <Tab eventKey="flightInfo" title="Airport Pickup">
                <StudentFlightInfoForm
                  innerRef={StudentFlightInfoFormRef}
                  onSubmit={handleStudentFlightInfoFormSubmit}
                  formReadOnly={readOnly}
                  optionReferences={optionReferences}
                  loadedData={loadedData[userId].studentFlightInfo}
                />
              </Tab>
              <Tab eventKey="tempHousing" title="Temporary Housing">
                <StudentTempHousingForm
                  innerRef={StudentTempHousingFormRef}
                  onSubmit={handleStudentTempHousingFormSubmit}
                  formReadOnly={readOnly}
                  optionReferences={optionReferences}
                  loadedData={loadedData[userId].studentTempHousing}
                />
              </Tab>
              { adminView ?
                <Tab eventKey="comment" title="Comment">
                  <StudentCommentForm
                    innerRef={studentCommentFormRef}
                    onSubmit={handleStudentCommentFormSubmit}
                    formReadOnly={readOnly}
                    adminView={true}
                    loadedData={loadedData[userId].studentComment}
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