import React, {useState} from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';

const AnnouncementPage = () => {
    const [annoucementText, setAnnoucementText] = useState('This website is open for registration now, and is designed to help Georgia Tech NEW students from China.\n' +
    '\n' +
    'PLEASE DO NOT WRITE CHINESE IN ANY TEXT BOX AREA!!! IT WILL CREATE ERROR!\n' +
    '\n' +
    'NOTICE - There will be LIMITED temporary housing this year. ');

    return (
        <Container className="mt-5">
            <AppTitle />
            <Row className="mt-5 nrw-pretty-box-layout">
                <Col className="pretty-box">
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