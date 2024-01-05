import React from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const StudentProfileForm = ({ innerRef, onSubmit }) => {
  const { Formik } = formik;

  const initialValues = {
    firstName: '',
    lastName: '',
    englishName: '',
    sex: '',
    isNew: '',
    fromSchool: '',
    comeAs: '',
    major: '',
    majorOther: '',
    hasCompanion: '',
    emailAddress: '',
    weChatId: '',
    chinaPhoneNumber: '',
    usPhoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
  }

  const requiredAlphaTest = yup.string().required('Required!').matches(/^[a-zA-Z]+$/, { message: 'Can only contain English letters!', excludeEmptyString: true });
  const requiredAlphaNumTest = yup.string().required('Required!').matches(/^[a-zA-Z0-9]+$/, { message: 'Can only contain English letters and numbers!', excludeEmptyString: true });
  const requireNoSpaceTest = yup.string().required('Required!').matches(/^[^ ]+$/, { message: 'Cannot contain any space!', excludeEmptyString: true });
  const optionalAlphaSpaceTest = yup.string().matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const requiredSelectTest = yup.string().required('Required!');
  const emailAddressTest = yup.string().email('Must be a valid email address').required('Required!');
  const phoneNumberTest = yup.string()
    .min(8, 'Too Short!')
    .matches( /^[0-9\+\-\(\) ]*$/, 'Must be a valid phone number' );
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

  const schema = yup.object().shape({
      firstName: requiredAlphaTest,
      lastName: requiredAlphaTest,
      englishName: optionalAlphaSpaceTest,
      sex: requiredSelectTest,
      isNew: requiredSelectTest,
      comeAs: requiredSelectTest,
      fromSchool: optionalAlphaSpaceTest,
      major: requiredSelectTest,
      majorOther: yup.string()
      .when(
          'major', 
          {
              is: 'other',
              then: () => requiredAlphaTest,
          }),
      hasCompanion: requiredSelectTest,
      emailAddress: emailAddressTest,
      weChatId: requireNoSpaceTest,
      chinaPhoneNumber: phoneNumberTest,
      usPhoneNumber: phoneNumberTest,
      username: requiredAlphaNumTest,
      password: strongPasswordTest,
      confirmPassword: confirmPasswordTest,
  });

  const sexOptions = [
    { value: '', label: "Select an option" },
    { value: 'male', label: "Male" },
    { value: 'female', label: "Female" },
  ];

  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes" },
    { value: 'no', label: "No" },
  ];

  const comeASOptions = [
    { value: '', label: "Select an option" },
    { value: 'undergrad', label: "Undergradute Student" },
    { value: 'grad', label: "Graduate Student" },
    { value: 'visiting', label: "Visiting Scholar" },
    { value: 'other', label: "Other" },
  ];

  const majorOptions = [
    { value: '', label: "Select an option" },
    { value: 'cs', label: "CS" },
    { value: 'ece', label: "ECE" },
    { value: 'math', label: "MATH" },
    { value: 'eas', label: "EAS" },
    { value: 'other', label: "Other (Please provided the name)"},
  ];

  return (
    <Formik
      innerRef={innerRef}
      validationSchema={schema}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="studentProfileFormFirstName">
              <RequiredFieldFormLabel>First Name (名)</RequiredFieldFormLabel>
              <Form.Control
                type="text"
                name='firstName'
                value={values.firstName}
                onChange={handleChange}
                isValid={touched.firstName && !errors.firstName}
                isInvalid={touched.firstName && !!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="studentProfileFormLastName">
              <RequiredFieldFormLabel>Last Name (姓)</RequiredFieldFormLabel>
              <Form.Control
                type="text"
                name='lastName'
                value={values.lastName}
                onChange={handleChange}
                isValid={touched.lastName && !errors.lastName}
                isInvalid={touched.lastName && !!errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormEnglishName">
              <Form.Label>English Name (if you have one):</Form.Label>
              <Form.Control
                type="text"
                name='englishName'
                value={values.englishName}
                onChange={handleChange}
                isValid={touched.englishName && !errors.englishName && values.englishName != ''}
                isInvalid={touched.englishName && !!errors.englishName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.englishName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormGender">
              <RequiredFieldFormLabel>Sex</RequiredFieldFormLabel>
              <Form.Select
                name='sex'
                onChange={handleChange}
                value={values.sex}
                isValid={touched.sex && !errors.sex}
                isInvalid={touched.sex && !!errors.sex}
              >
                {sexOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.sex}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormIsNew">
              <RequiredFieldFormLabel>Are you a first-time (new) student?</RequiredFieldFormLabel>
              <Form.Select
                name='isNew'
                onChange={handleChange}
                value={values.isNew}
                isValid={touched.isNew && !errors.isNew}
                isInvalid={touched.isNew && !!errors.isNew}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.isNew}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormComeAs">
              <RequiredFieldFormLabel>I'm coming to the US to be a</RequiredFieldFormLabel>
              <Form.Select
                name='comeAs'
                onChange={handleChange}
                value={values.comeAs}
                isValid={touched.comeAs && !errors.comeAs}
                isInvalid={touched.comeAs && !!errors.comeAs}
              >
                {comeASOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.comeAs}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
          <Form.Group as={Col} controlId="studentProfileFormFromSchool">
              <Form.Label>School you graduated from</Form.Label>
              <Form.Control
                type="text"
                name='fromSchool'
                value={values.fromSchool}
                onChange={handleChange}
                isValid={touched.fromSchool && !errors.fromSchool && values.fromSchool != ''}
                isInvalid={touched.fromSchool && !!errors.fromSchool}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fromSchool}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="studentProfileFormMajor">
              <RequiredFieldFormLabel>Major</RequiredFieldFormLabel>
              <Form.Select
                name='major'
                onChange={handleChange}
                value={values.major}
                isValid={touched.major && !errors.major}
                isInvalid={touched.major && !!errors.major}
              >
                {majorOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.major}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="studentProfileFormMajorOther">
              <Form.Label>If Other:</Form.Label>
              <Form.Control
                    name='majorOther'
                    value={values.majorOther}
                    onChange={handleChange}
                    isValid={touched.majorOther && !errors.majorOther}
                    isInvalid={touched.majorOther && !!errors.majorOther}
              />
              <Form.Control.Feedback type="invalid">
                {errors.majorOther}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormHasCompanion">
              <RequiredFieldFormLabel>Bringing family members or frinds together?</RequiredFieldFormLabel>
              <Form.Select
                name='hasCompanion'
                onChange={handleChange}
                value={values.hasCompanion}
                isValid={touched.hasCompanion && !errors.hasCompanion}
                isInvalid={touched.hasCompanion && !!errors.hasCompanion}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.hasCompanion}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormEmailAddress">
              <RequiredFieldFormLabel>Email Address</RequiredFieldFormLabel>
              <Form.Control
                type="email"
                name='emailAddress'
                value={values.emailAddress}
                onChange={handleChange}
                isValid={touched.emailAddress && !errors.emailAddress}
                isInvalid={touched.emailAddress && !!errors.emailAddress}
              />
              <Form.Control.Feedback type="invalid">
                {errors.emailAddress}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormWeChatId">
              <RequiredFieldFormLabel>WeChat ID (微信号)</RequiredFieldFormLabel>
              <Form.Control
                name='weChatId'
                value={values.weChatId}
                onChange={handleChange}
                isValid={touched.weChatId && !errors.weChatId}
                isInvalid={touched.weChatId && !!errors.weChatId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.weChatId}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormChinaPhoneNumber">
              <Form.Label>Phone Number (China)</Form.Label>
              <Form.Control
                name='chinaPhoneNumber'
                onChange={handleChange}
                value={values.chinaPhoneNumber}
                isValid={touched.chinaPhoneNumber && !errors.chinaPhoneNumber && values.chinaPhoneNumber !== ''}
                isInvalid={touched.chinaPhoneNumber && !!errors.chinaPhoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.chinaPhoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormUSPhoneNumber">
              <Form.Label>Phone Number (U.S.)</Form.Label>
              <Form.Control
                name='usPhoneNumber'
                onChange={handleChange}
                value={values.usPhoneNumber}
                isValid={touched.usPhoneNumber && !errors.usPhoneNumber && values.usPhoneNumber !== ''}
                isInvalid={touched.usPhoneNumber && !!errors.usPhoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.usPhoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormUsername">
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
            <Form.Group as={Col} controlId="studentProfileFormPassword">
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
            <Form.Group as={Col} controlId="studentProfileFormConfirmPassword">
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
        </Form>
      )}
    </Formik>
  );
};

export default StudentProfileForm;