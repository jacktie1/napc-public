import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const NotFoundPage = () => (
  <Container className="mt-5">
    <Row>
      <Col md={{ span: 6, offset: 3 }} className="text-center">
        <h1 className="display-4">404</h1>
        <p className="lead">Page not found</p>
        <p>Oops! The page you are looking for might be in another castle.</p>
      </Col>
    </Row>
  </Container>
);

export default NotFoundPage;