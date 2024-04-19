import React, { useMemo } from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const UserSecurityQuestionsForm = ({ innerRef, onSubmit, optionReferences }) => {
    const { Formik } = formik;

    const securityQuestionOptionReferences = useMemo(() => {
      let securityQuestionOptionReferences = optionReferences.SecurityQuestion ?? [];

      securityQuestionOptionReferences.sort(() => Math.random() - 0.5);

      return securityQuestionOptionReferences;
    }, [optionReferences]);

    const securityQuestionOptions1 = useMemo(() => {
      let securityQuestionOptions1 = [{ key: '', value: "Select an option" }];

      for (let i = 0; i < securityQuestionOptionReferences.length; i++) {
        if (i % 3 === 0) {
            securityQuestionOptions1.push({ key: securityQuestionOptionReferences[i].referenceId, value: securityQuestionOptionReferences[i].value });
        }
      }

      return securityQuestionOptions1;
    }, [securityQuestionOptionReferences]);

    const securityQuestionOptions2 = useMemo(() => {
      let securityQuestionOptions2 = [{ key: '', value: "Select an option" }];

      for (let i = 0; i < securityQuestionOptionReferences.length; i++) {
        if (i % 3 === 1) {
            securityQuestionOptions2.push({ key: securityQuestionOptionReferences[i].referenceId, value: securityQuestionOptionReferences[i].value });
        }
      }

      return securityQuestionOptions2;
    }, [securityQuestionOptionReferences]);

    const securityQuestionOptions3 = useMemo(() => {
      let securityQuestionOptions3 = [{ key: '', value: "Select an option" }];

      for (let i = 0; i < securityQuestionOptionReferences.length; i++) {
        if (i % 3 === 2) {
            securityQuestionOptions3.push({ key: securityQuestionOptionReferences[i].referenceId, value: securityQuestionOptionReferences[i].value });
        }
      }

      return securityQuestionOptions3;
    }, [securityQuestionOptionReferences]);

    const requiredSelectTest = yup.string().required('Required!');

    const requiredNonEmptyTest = yup.string().required('Required!').test(
        'is-non-empty',
        'Cannot be empty!',
        (value) => value.trim() !== '',
    )

    const initialValues = {
        securityQuestionReferenceId1: '',
        securityAnswer1: '',
        securityQuestionReferenceId2: '',
        securityAnswer2: '',
        securityQuestionReferenceId3: '',
        securityAnswer3: '',
    };

    const schema = yup.object().shape({
        securityQuestionReferenceId1: requiredSelectTest,
        securityAnswer1: requiredNonEmptyTest,
        securityQuestionReferenceId2: requiredSelectTest,
        securityAnswer2: requiredNonEmptyTest,
        securityQuestionReferenceId3: requiredSelectTest,
        securityAnswer3: requiredNonEmptyTest,
    });

    return (
        <Formik
          innerRef={innerRef}
          validationSchema={schema}
          onSubmit={onSubmit}
          enableReinitialize={true}
          initialValues={initialValues}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userSecurityQuestionsFormSecurityQuestionReferenceId1">
                    <RequiredFieldFormLabel>Security Question 1</RequiredFieldFormLabel>
                    <Form.Select
                      name='securityQuestionReferenceId1'
                      onChange={handleChange}
                      value={values.securityQuestionReferenceId1}
                      isValid={touched.securityQuestionReferenceId1 && !errors.securityQuestionReferenceId1}
                      isInvalid={touched.securityQuestionReferenceId1 && !!errors.securityQuestionReferenceId1}
                    >
                      {securityQuestionOptions1.map((option) => (
                        <option key={option.key} value={option.key} label={option.value} />
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.securityQuestionReferenceId1}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userSecurityQuestionsFormSecurityAnswer1">
                    <RequiredFieldFormLabel>Security Question Answer 1</RequiredFieldFormLabel>
                    <Form.Control
                      name='securityAnswer1'
                      value={values.securityAnswer1}
                      onChange={handleChange}
                      isValid={touched.securityAnswer1 && !errors.securityAnswer1}
                      isInvalid={touched.securityAnswer1 && !!errors.securityAnswer1}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.securityAnswer1}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userSecurityQuestionsFormSecurityQuestionReferenceId2">
                    <RequiredFieldFormLabel>Security Question 2</RequiredFieldFormLabel>
                    <Form.Select
                      name='securityQuestionReferenceId2'
                      onChange={handleChange}
                      value={values.securityQuestionReferenceId2}
                      isValid={touched.securityQuestionReferenceId2 && !errors.securityQuestionReferenceId2}
                      isInvalid={touched.securityQuestionReferenceId2 && !!errors.securityQuestionReferenceId2}
                    >
                      {securityQuestionOptions2.map((option) => (
                        <option key={option.key} value={option.key} label={option.value} />
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.securityQuestionReferenceId2}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userSecurityQuestionsFormSecurityAnswer2">
                    <RequiredFieldFormLabel>Security Question Answer 2</RequiredFieldFormLabel>
                    <Form.Control
                      name='securityAnswer2'
                      value={values.securityAnswer2}
                      onChange={handleChange}
                      isValid={touched.securityAnswer2 && !errors.securityAnswer2}
                      isInvalid={touched.securityAnswer2 && !!errors.securityAnswer2}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.securityAnswer2}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userSecurityQuestionsFormSecurityQuestionReferenceId3">
                    <RequiredFieldFormLabel>Security Question 3</RequiredFieldFormLabel>
                    <Form.Select
                      name='securityQuestionReferenceId3'
                      onChange={handleChange}
                      value={values.securityQuestionReferenceId3}
                      isValid={touched.securityQuestionReferenceId3 && !errors.securityQuestionReferenceId3}
                      isInvalid={touched.securityQuestionReferenceId3 && !!errors.securityQuestionReferenceId3}
                    >
                      {securityQuestionOptions3.map((option) => (
                        <option key={option.key} value={option.key} label={option.value} />
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.securityQuestionReferenceId3}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userSecurityQuestionsFormSecurityAnswer3">
                    <RequiredFieldFormLabel>Security Question Answer 3</RequiredFieldFormLabel>
                    <Form.Control
                      name='securityAnswer3'
                      value={values.securityAnswer3}
                      onChange={handleChange}
                      isValid={touched.securityAnswer3 && !errors.securityAnswer3}
                      isInvalid={touched.securityAnswer3 && !!errors.securityAnswer3}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.securityAnswer3}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
            </Form>
          )}
        </Formik>
      );
};

export default UserSecurityQuestionsForm;
