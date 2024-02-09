import React, { useState, useRef } from 'react';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import VolunteerProfileForm from './VolunteerProfileForm';
import VolunteerPickupCapacityForm from './VolunteerPickupCapacityForm';
import VolunteerHousingCapacityForm from './VolunteerHousingCapacityForm';

const VolunteerDetailsModal = ({ value, readOnly, adminView }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('profile');

    var studentProfile;
    var pickupCapacity;
    var housingCapacity;

    const studentProfileFormRef = useRef(null);
    const VolunteerPickupCapacityFormRef = useRef(null);
    const VolunteerHousingCapacityFormRef = useRef(null);

    const modalSize = 'md';
  
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
      else if (currentTab === 'pickupCapacity')
      {
        VolunteerPickupCapacityFormRef.current.submitForm().then(() => {
            const VolunteerPickupCapacityFormErros = VolunteerPickupCapacityFormRef.current.errors;
        
            if (Object.keys(VolunteerPickupCapacityFormErros).length === 0)
            {
              alert('success');
              handleClose();
            }
        });
      }
      else if (currentTab === 'housingCapacity')
      {
        VolunteerHousingCapacityFormRef.current.submitForm().then(() => {
            const VolunteerHousingCapacityFormErros = VolunteerHousingCapacityFormRef.current.errors;
        
            if (Object.keys(VolunteerHousingCapacityFormErros).length === 0)
            {
              alert('success');
              handleClose();
            }
        });
      }
    }

    const handleVolunteerProfileSubmit = (values, { setSubmitting }) => {
      studentProfile = values;
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
            <Tabs
              defaultActiveKey="profile"
              id="student-details-modal-tabs"
              className="mb-3"
              onSelect={handleTabSelect}
            >
              <Tab eventKey="profile" title="Volunteer Profile">
                <VolunteerProfileForm
                  userId={value}
                  innerRef={studentProfileFormRef}
                  onSubmit={handleVolunteerProfileSubmit}
                  adminView={adminView}
                  formReadOnly={readOnly}
                  lazyLoadToggle={currentTab==='profile'}
                />
              </Tab>
              <Tab eventKey="pickupCapacity" title="Airport Pickup">
                <VolunteerPickupCapacityForm
                  userId={value}
                  innerRef={VolunteerPickupCapacityFormRef}
                  onSubmit={handleVolunteerPickupCapacityFormSubmit}
                  formReadOnly={readOnly}
                  lazyLoadToggle={currentTab==='pickupCapacity'}

                />
              </Tab>
              <Tab eventKey="housingCapacity" title="Temporary Housing">
                <VolunteerHousingCapacityForm
                  userId={value}
                  innerRef={VolunteerHousingCapacityFormRef}
                  onSubmit={handleVolunteerHousingCapacityFormSubmit}
                  formReadOnly={readOnly}
                  lazyLoadToggle={currentTab==='housingCapacity'}
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