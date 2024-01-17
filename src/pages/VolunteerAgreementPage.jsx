import React,  { useState, useContext } from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Button, Row, Col, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../auth/UserSession';


const VolunteerAgreementPage = () => {
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { endSession } = useContext(UserContext);

    const handleLogout = () => {
        handleClose();
        endSession();
        navigate('/login');
    };

    return (
        <>
            <Container className="mt-5">
                <AppTitle />
                <Row className="mt-5 wide-pretty-box-layout">
                    <Col className="pretty-box">
                        <Form>
                            <Alert dismissible variant='info' style={{ textAlign: 'center' }}>
                                <Alert.Heading>Thank you very much for volunteering!</Alert.Heading>
                                <p>
                                    All information you provided will be kept confidential.<br/>
                                    We do not share your information with any other agency or third party.<br/><br/>
                                    As a volunteer, you will get a reminder email before you go to the airport.
                                </p>
                            </Alert>
                            <h2 className="pretty-box-heading">Volunteer Agreement</h2>
                            <hr/>
                            <ul>
                                <li>Please do not charge anything for the pickup</li>
                                <li>Please check to be sure the flight is on time before you go to the airport</li>
                                <li>If you are driving a person to a home or apartment, please call the contact to be sure they will be home</li>
                            </ul>
                            <hr/>
                            <Button variant="primary" href='/volunteer/home' className="pretty-box-button">
                                Yes, I agree
                            </Button>
                            <Button variant="secondary" onClick={handleShow} className="pretty-box-button">
                                No, I do not agree
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>You will return to the Login page - Continue?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                    Continue
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default VolunteerAgreementPage;