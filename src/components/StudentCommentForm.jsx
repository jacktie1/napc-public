import React, { useEffect } from 'react';
import { Row, Form, Col, Alert } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';

const StudentCommentForm = ({ innerRef, onSubmit, adminView, loadedData }) => {
  const { Formik } = formik;

  const initialValues = adminView ? {
    studentComment: '',
    adminComment: ''
  } : {
    studentComment: '',
  }

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0)
    {
      let formData = {
        studentComment: formUtils.toOptionalTextValue(loadedData.studentComment),
      };

      if(adminView)
      {
        formData = {
          ...formData,
          adminComment: formUtils.toOptionalTextValue(loadedData.adminComment),
        }
      }

      innerRef.current.setValues(formData);
    }
  }, [loadedData, innerRef, adminView]);

  const schema = adminView ? yup.object().shape({
    studentComment: yup.string().max(500),
    adminComment: yup.string().max(500),
  }) : yup.object().shape({
    studentComment: yup.string().max(500),
  });

  return (
    <Formik
      innerRef={innerRef}
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentCommentFormStudentComment">
              { !adminView ?
                <>
                  <Form.Label>Do you have any studentComment or special needs (Maximum 500 characters):</Form.Label>
                  <Alert variant='warning'>Please let us know if you already got VISA or NOT in the studentComment.</Alert>
                </>
              :
              <>
                <Form.Label>Any Comment</Form.Label>
              </>
              }
              <Form.Control
                 as="textarea"
                 rows={3}
                name='studentComment'
                value={values.studentComment}
                onChange={handleChange}
                isValid={touched.studentComment && !errors.studentComment}
                isInvalid={touched.studentComment && !!errors.studentComment}
              />
              <Form.Control.Feedback type="invalid">
                {errors.studentComment}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { adminView ?
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentCommentFormAdminComment">
              <Form.Label>Admin Comment</Form.Label>
              <Form.Control
                 as="textarea"
                 rows={3}
                name='adminComment'
                value={values.adminComment}
                onChange={handleChange}
                isValid={touched.adminComment && !errors.adminComment}
                isInvalid={touched.adminComment && !!errors.adminComment}
              />
              <Form.Control.Feedback type="invalid">
                {errors.adminComment}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          : null }
        </Form>
      )}
    </Formik>
  );
};

export default StudentCommentForm;