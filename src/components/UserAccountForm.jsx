import React, { useMemo } from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const UserAccountForm = ({ innerRef, onSubmit, optionReferences }) => {
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
            securityQuestionOptions1.push({ key: securityQuestionOptionReferences[i].id, value: securityQuestionOptionReferences[i].value });
        }
      }

      return securityQuestionOptions1;
    }, [optionReferences]);

    const securityQuestionOptions2 = useMemo(() => {
      let securityQuestionOptions2 = [{ key: '', value: "Select an option" }];

      for (let i = 0; i < securityQuestionOptionReferences.length; i++) {
        if (i % 3 === 1) {
            securityQuestionOptions2.push({ key: securityQuestionOptionReferences[i].id, value: securityQuestionOptionReferences[i].value });
        }
      }

      return securityQuestionOptions2;
    }, [optionReferences]);

    const securityQuestionOptions3 = useMemo(() => {
      let securityQuestionOptions3 = [{ key: '', value: "Select an option" }];

      for (let i = 0; i < securityQuestionOptionReferences.length; i++) {
        if (i % 3 === 2) {
            securityQuestionOptions3.push({ key: securityQuestionOptionReferences[i].id, value: securityQuestionOptionReferences[i].value });
        }
      }

      return securityQuestionOptions3;
    }, [optionReferences]);

    const requiredSelectTest = yup.string().required('Required!');

    const requiredNonEmptyTest = yup.string().required('Required!').test(
        'is-non-empty',
        'Cannot be empty!',
        (value) => value.trim() !== '',
    )

    const requiredAlphaNumTest = yup.string().required('Required!').matches(/^[a-zA-Z0-9]+$/, { message: 'Can only contain English letters and numbers!', excludeEmptyString: true });

    const strongPasswordTest = yup.string()
    .required('Required!')
    .matches(
      /^[0-9a-zA-Z\!\@\#\$\%\^\&\*\(\)\+]+$/,
      "Cannot contain special symbols other than !@#$%^&*()+"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must contain at least 8 characters, which includes at least one Uppercase letter, one Lowercase letter, and one Number"
    );

    const confirmPasswordTest = yup.string()
    .required('Required!')
    .oneOf([yup.ref('password')], 'Your passwords do not match!');

    const initialValues = {
        username: '',
        password: '',
        confirmPassword: '',
        securityQuestionReferenceId1: '',
        securityAnswer1: '',
        securityQuestionReferenceId2: '',
        securityAnswer2: '',
        securityQuestionReferenceId3: '',
        securityAnswer3: '',
    };

    const schema = yup.object().shape({
        username: requiredAlphaNumTest,
        password: strongPasswordTest,
        confirmPassword: confirmPasswordTest,
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
                    <Form.Group as={Col} controlId="userAccountFormUsername">
                    <RequiredFieldFormLabel>Username</RequiredFieldFormLabel>
                    <Form.Control
                        name='username'
                        value={values.username}
                        onChange={handleChange}
                        isValid={touched.username && !errors.username}
                        isInvalid={touched.username && !!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.username}
                    </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userAccountFormPassword">
                    <RequiredFieldFormLabel>Password</RequiredFieldFormLabel>
                    <Form.Control
                      name='password'
                      type='password'
                      value={values.password}
                      onChange={handleChange}
                      isValid={touched.password && !errors.password}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userAccountFormConfirmPassword">
                    <RequiredFieldFormLabel>Confirm Password</RequiredFieldFormLabel>
                    <Form.Control
                      name='confirmPassword'
                      type='password'
                      value={values.confirmPassword}
                      onChange={handleChange}
                      isValid={touched.confirmPassword && !errors.confirmPassword}
                      isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userAccountFormSecurityQuestionReferenceId1">
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
                  <Form.Group as={Col} controlId="userAccountFormSecurityAnswer1">
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
                  <Form.Group as={Col} controlId="userAccountFormSecurityQuestionReferenceId2">
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
                  <Form.Group as={Col} controlId="userAccountFormSecurityAnswer2">
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
                  <Form.Group as={Col} controlId="userAccountFormSecurityQuestionReferenceId3">
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
                  <Form.Group as={Col} controlId="userAccountFormSecurityAnswer3">
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

export default UserAccountForm;
