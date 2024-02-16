import React, { useEffect, useMemo } from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';


const StudentProfileForm = ({ innerRef, onSubmit, optionReferences, loadedData, formReadOnly }) => {
  const { Formik } = formik;

  const majorOptions = useMemo(() => {
    let majorOptionReferences = optionReferences.Major ?? [];
    majorOptionReferences = majorOptionReferences.map((optionReference) => {
      return { id: optionReference.referenceId, value: optionReference.value };
    });
    return [{ id: '', value: "Select an option" }, ...majorOptionReferences, { id: 'other', value: "Other" }];
  }, [optionReferences]);

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0)
    {
      let formData = formUtils.toStudentProfileForm(loadedData);
      innerRef.current.setValues(formData);
    }
  }, [loadedData, innerRef]);

  const initialValues = {
    firstName: '',
    lastName: '',
    englishName: '',
    gender: '',
    isNewStudent: '',
    graduatesFrom: '',
    studentType: '',
    majorReferenceId: '',
    customMajor: '',
    hasCompanion: '',
    emailAddress: '',
    wechatId: '',
    cnPhoneNumber: '',
    usPhoneNumber: '',
  }

  const requiredAlphaTest = yup.string().required('Required!').matches(/^[a-zA-Z]+$/, { message: 'Can only contain English letters!', excludeEmptyString: true });
  const requireNoSpaceTest = yup.string().required('Required!').matches(/^[^ ]+$/, { message: 'Cannot contain any space!', excludeEmptyString: true });
  const optionalAlphaSpaceTest = yup.string().matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const requiredAlphaSpaceTest = yup.string().required('Required!').matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const requiredSelectTest = yup.string().required('Required!');
  const emailAddressTest = yup.string().email('Must be a valid email address').required('Required!');
  const phoneNumberTest = yup.string()
    .min(8, 'Too Short!')
    .matches( /^[0-9\+\-\(\) ]*$/, 'Must be a valid phone number' );

  const schema = yup.object().shape({
      firstName: requiredAlphaTest,
      lastName: requiredAlphaTest,
      englishName: optionalAlphaSpaceTest,
      gender: requiredSelectTest,
      isNewStudent: requiredSelectTest,
      studentType: requiredSelectTest,
      graduatesFrom: optionalAlphaSpaceTest,
      majorReferenceId: requiredSelectTest,
      customMajor: yup.string()
      .when(
          'majorReferenceId', 
          {
              is: 'other',
              then: () => requiredAlphaSpaceTest.required('Required if no provided major is selected!'),
          }),
      hasCompanion: requiredSelectTest,
      emailAddress: emailAddressTest,
      wechatId: requireNoSpaceTest,
      cnPhoneNumber: phoneNumberTest,
      usPhoneNumber: phoneNumberTest,
  });

  const genderOptions = [
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

  return (
    <Formik
      innerRef={innerRef}
      validationSchema={schema}
      onSubmit={onSubmit}
      enableReinitialize={true}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, setFieldValue, values, touched, errors }) => (
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
                readOnly={formReadOnly}
                disabled={formReadOnly}
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
                readOnly={formReadOnly}
                disabled={formReadOnly}
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
                isValid={touched.englishName && !errors.englishName && values.englishName !== ''}
                isInvalid={touched.englishName && !!errors.englishName}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.englishName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormGender">
              <RequiredFieldFormLabel>Gender</RequiredFieldFormLabel>
              <Form.Select
                name='gender'
                onChange={handleChange}
                value={values.gender}
                isValid={touched.gender && !errors.gender}
                isInvalid={touched.gender && !!errors.gender}
                disabled={formReadOnly}
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.gender}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormIsNewStudent">
              <RequiredFieldFormLabel>Are you a first-time (new) student?</RequiredFieldFormLabel>
              <Form.Select
                name='isNewStudent'
                onChange={handleChange}
                value={values.isNewStudent}
                isValid={touched.isNewStudent && !errors.isNewStudent}
                isInvalid={touched.isNewStudent && !!errors.isNewStudent}
                disabled={formReadOnly}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.isNewStudent}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormStudentType">
              <RequiredFieldFormLabel>I'm coming to the US to be a</RequiredFieldFormLabel>
              <Form.Select
                name='studentType'
                onChange={handleChange}
                value={values.studentType}
                isValid={touched.studentType && !errors.studentType}
                isInvalid={touched.studentType && !!errors.studentType}
                disabled={formReadOnly}
              >
                {comeASOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.studentType}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
          <Form.Group as={Col} controlId="studentProfileFormGraduatesFrom">
              <Form.Label>School you graduated from</Form.Label>
              <Form.Control
                type="text"
                name='graduatesFrom'
                value={values.graduatesFrom}
                onChange={handleChange}
                isValid={touched.graduatesFrom && !errors.graduatesFrom && values.graduatesFrom !== ''}
                isInvalid={touched.graduatesFrom && !!errors.graduatesFrom}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.graduatesFrom}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormMajorReferenceId">
              <RequiredFieldFormLabel>Major (Select 'Other' if not present)</RequiredFieldFormLabel>
              <Form.Select
                name='majorReferenceId'
                onChange={(e) => {setFieldValue('customMajor', ''); handleChange(e);}}
                value={values.majorReferenceId}
                isValid={touched.majorReferenceId && !errors.majorReferenceId}
                isInvalid={touched.majorReferenceId && !!errors.majorReferenceId}
                disabled={formReadOnly}
              >
                {majorOptions.map((option) => (
                  <option key={option.id} value={option.id} label={option.value} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.majorReferenceId}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormCustomMajor">
              <Form.Label>If Other:</Form.Label>
              <Form.Control
                    name='customMajor'
                    value={values.customMajor}
                    onChange={(e) => {setFieldValue('majorReferenceId', 'other'); handleChange(e);}}
                    isValid={touched.customMajor && !errors.customMajor}
                    isInvalid={touched.customMajor && !!errors.customMajor}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.customMajor}
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
                disabled={formReadOnly}
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
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.emailAddress}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormWechatId">
              <RequiredFieldFormLabel>WeChat ID (微信号)</RequiredFieldFormLabel>
              <Form.Control
                name='wechatId'
                value={values.wechatId}
                onChange={handleChange}
                isValid={touched.wechatId && !errors.wechatId}
                isInvalid={touched.wechatId && !!errors.wechatId}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.wechatId}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormCnPhoneNumber">
              <Form.Label>Phone Number (China)</Form.Label>
              <Form.Control
                name='cnPhoneNumber'
                onChange={handleChange}
                value={values.cnPhoneNumber}
                isValid={touched.cnPhoneNumber && !errors.cnPhoneNumber && values.cnPhoneNumber !== ''}
                isInvalid={touched.cnPhoneNumber && !!errors.cnPhoneNumber}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cnPhoneNumber}
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
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.usPhoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default StudentProfileForm;