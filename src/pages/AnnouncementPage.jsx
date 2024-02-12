import React, { useState, useEffect } from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';

const AnnouncementPage = () => {
    const [serverError, setServerError] = useState('');

    const [annoucementText, setAnnoucementText] = useState('');

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getManagement`);
            
                let managent = axiosResponse?.data?.result?.management;
            
                // Error, we just forbid the user to register
                if(!managent)
                {
                    setAnnoucementText('No announcement');
                    throw new Error('No management data found');
                }
            
                setAnnoucementText(managent.announcement);
            } catch (axiosError) {
                let { errorMessage } = parseAxiosError(axiosError);
                setAnnoucementText('No announcement');      
                setServerError(errorMessage);
            }
        };

        fetchAnnouncement();
    }, []);

    return (
        <Container className="mt-5">
            <AppTitle />
            <Row className="mt-5 nrw-pretty-box-layout">
                <Col className="pretty-box">
                {serverError && (
                    <Alert variant='danger'>
                    {serverError}
                    </Alert>
                )}
                <Form>
                    <h2 className="pretty-box-heading">Announcement</h2>

                    <Form.Group controlId="announcementFormText">
                        <Form.Control
                            as="textarea"
                            rows={8}
                            value={annoucementText}
                            style={{ whiteSpace: 'pre-line' }}
                            readOnly
                        />
                        </Form.Group>
                        <hr/>
                        <Button variant="primary" href='/student/home' className="pretty-box-button">
                            Continue Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AnnouncementPage;