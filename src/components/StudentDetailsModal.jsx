import React, { useState, useRef } from 'react';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import StudentProfileForm from './StudentProfileForm';
import FlightInfoForm from './FlightInfoForm';
import TempHousingForm from './TempHousingForm';
import StudentCommentForm from './StudentCommentForm';

const StudentDetailsModal = ({ value, readOnly, adminView }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('profile');

    var studentProfile;
    var flightInfo;
    var tempHousing;
    var studentComment;

    const studentProfileFormRef = useRef(null);
    const flightInfoFormRef = useRef(null);
    const tempHousingFormRef = useRef(null);
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

    const handleSubmit = () => {
      if (currentTab === 'profile')
      {
        studentProfileFormRef.current.submitForm().then(() => {
            const studentProfileErrors = studentProfileFormRef.current.errors;
        
            if (Object.keys(studentProfileErrors).length === 0)
            {
              alert('success');
              handleClose();
            }
        });
      }
      else if (currentTab === 'flightInfo')
      {
        flightInfoFormRef.current.submitForm().then(() => {
            const FlightInfoFormErros = flightInfoFormRef.current.errors;
        
            if (Object.keys(FlightInfoFormErros).length === 0)
            {
              alert('success');
              handleClose();
            }
        });
      }
      else if (currentTab === 'tempHousing')
      {
        tempHousingFormRef.current.submitForm().then(() => {
            const tempHousingFormErros = tempHousingFormRef.current.errors;
        
            if (Object.keys(tempHousingFormErros).length === 0)
            {
              alert('success');
              handleClose();
            }
        });
      }
      else if (currentTab === 'comment')
      {
        studentCommentFormRef.current.submitForm().then(() => {
            const studentCommentFormErros = studentCommentFormRef.current.errors;
        
            if (Object.keys(studentCommentFormErros).length === 0)
            {
              alert('success');
              handleClose();
            }
        });
      }
    }

    const handleStudentProfileSubmit = (values, { setSubmitting }) => {
      studentProfile = values;
      setSubmitting(false);
    };
  
    const handleFlightInfoFormSubmit = (values, { setSubmitting }) => {
      flightInfo = values;
      setSubmitting(false);
    };
  
    const handleTempHousingFormSubmit = (values, { setSubmitting }) => {
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
          {value}
        </div>

        <Modal show={showModal} onHide={handleClose} centered size={modalSize}>
          <Modal.Header closeButton>
            <Modal.Title>Student Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs
              defaultActiveKey="profile"
              id="student-details-modal-tabs"
              className="mb-3"
              onSelect={handleTabSelect}
            >
              <Tab eventKey="profile" title="Student Profile">
                <StudentProfileForm
                  userId={value}
                  innerRef={studentProfileFormRef}
                  onSubmit={handleStudentProfileSubmit}
                  formReadOnly={readOnly}
                  lazyLoadToggle={currentTab==='profile'}
                />
              </Tab>
              <Tab eventKey="flightInfo" title="Airport Pickup">
                <FlightInfoForm
                  userId={value}
                  innerRef={flightInfoFormRef}
                  onSubmit={handleFlightInfoFormSubmit}
                  formReadOnly={readOnly}
                  lazyLoadToggle={currentTab==='flightInfo'}
                />
              </Tab>
              <Tab eventKey="tempHousing" title="Temporary Housing">
                <TempHousingForm
                  userId={value}
                  innerRef={tempHousingFormRef}
                  onSubmit={handleTempHousingFormSubmit}
                  formReadOnly={readOnly}
                  lazyLoadToggle={currentTab==='tempHousing'}
                />
              </Tab>
              { adminView ?
                <Tab eventKey="comment" title="Comment">
                  <StudentCommentForm
                    userId={value}
                    innerRef={studentCommentFormRef}
                    onSubmit={handleTempHousingFormSubmit}
                    formReadOnly={readOnly}
                    adminView={true}
                    lazyLoadToggle={currentTab==='comment'}
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