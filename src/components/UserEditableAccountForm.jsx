import React, { useEffect } from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';


const UserEditableAccountForm = ({ innerRef, onSubmit, loadedData, formReadOnly }) => {
    const { Formik } = formik;

    useEffect(() => {
      if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0)
      {
        let formData = formUtils.toUserAccountForm(loadedData);
        innerRef.current.setValues(formData);
      }
    }, [loadedData, innerRef]);

    const requiredAlphaNumTest = yup.string().required('Required!').matches(/^[a-zA-Z0-9]+$/, { message: 'Can only contain English letters and numbers!', excludeEmptyString: true });

    const strongPasswordTest = yup.string()
    .nullable()
    .matches(
      /^[0-9a-zA-Z\!\@\#\$\%\^\&\*\(\)\+]+$/,
      "Cannot contain special symbols other than !@#$%^&*()+"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must contain at least 8 characters, which includes at least one Uppercase letter, one Lowercase letter, and one Number"
    );

    const confirmPasswordTest = yup.string()
    .when(
        'password', 
        {
            is: (password) => password !== '' && password !== null && password !== undefined,
            then: () => yup.string().required('Required!').oneOf([yup.ref('password')], 'Your passwords do not match!'),
        });

    const initialValues = {
        username: '',
        password: '',
        confirmPassword: ''
    };

    const schema = yup.object().shape({
        username: requiredAlphaNumTest,
        password: strongPasswordTest,
        confirmPassword: confirmPasswordTest,
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
                    <Form.Group as={Col} controlId="userEditableAccountFormUsername">
                    <RequiredFieldFormLabel>Username</RequiredFieldFormLabel>
                    <Form.Control
                        name='username'
                        value={values.username}
                        onChange={handleChange}
                        isValid={touched.username && !errors.username}
                        isInvalid={touched.username && !!errors.username}
                        readOnly={formReadOnly}
                        disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.username}
                    </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userEditableAccountFormPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      name='password'
                      type='password'
                      value={values.password}
                      onChange={handleChange}
                      isValid={touched.password && !errors.password}
                      isInvalid={touched.password && !!errors.password}
                      readOnly={formReadOnly}
                      disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="userEditableAccountFormConfirmPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      name='confirmPassword'
                      type='password'
                      value={values.confirmPassword}
                      onChange={handleChange}
                      isValid={touched.confirmPassword && !errors.confirmPassword}
                      isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                      readOnly={formReadOnly}
                      disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
            </Form>
          )}
        </Formik>
      );
};

export default UserEditableAccountForm;
