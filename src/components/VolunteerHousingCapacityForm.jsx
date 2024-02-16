import React, { useState, useEffect } from 'react';
import { Row, Form, Col } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';


const VolunteerHousingCapacityForm = ({ innerRef, onSubmit, loadedData, formReadOnly }) => {
  const { Formik } = formik;

  const [showCapacityDetails, setShowCapacityDetails] = useState(false);

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0)
    {
      let formData = formUtils.toVolunteerTempHousingForm(loadedData);

      if(formData.providesTempHousing === 'yes') {
        setShowCapacityDetails(true);
      }

      innerRef.current.setValues(formData);
    }
  }, [innerRef, loadedData]);

  const initialValues = {
    providesTempHousing: '',
    homeAddress: '',
    numMaxStudentsHosted: '',
    tempHousingStartDate: '',
    tempHousingEndDate: '',
    numDoubleBeds: '',
    numSingleBeds: '',
    genderPreference: '',
    providesRide: '',
    tempHousingComment: '',
  };

  const requiredAlphaNumSpaceTest =  yup.string().required('Required!').matches(/^[a-zA-Z0-9][a-zA-Z0-9, ]*$/, { message: 'Can only contain English letters, numbers, comma(,) and spaces!', excludeEmptyString: true });
  const capacityNumTest = yup.number().typeError('Must be a whole number!')
    .integer('Must be a whole number!')
    .min(0, 'Must be from 0-9')
    .max(9, 'Must be from 0-9');
  const optionalDateTest = yup.date().typeError('Must be a valid date!');
  const requiredSelectTest = yup.string().required('Required!');

  const schema = yup.object().shape({
    providesTempHousing: requiredSelectTest,
    homeAddress: yup.string().when('providesTempHousing', { is: 'yes', then: () => requiredAlphaNumSpaceTest}),
    numMaxStudentsHosted: capacityNumTest,
    tempHousingStartDate: optionalDateTest,
    tempHousingEndDate: optionalDateTest.min(yup.ref('tempHousingStartDate'), "End time cannot be before start time"),
    numDoubleBeds: capacityNumTest,
    numSingleBeds: capacityNumTest,
    genderPreference: '',
    tempHousingComment: yup.string().max(500),
  });

  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes" },
    { value: 'no', label: "No" },
  ];

  const genderOptions = [
    { value: '', label: "Select an option" },
    { value: 'male', label: "Male" },
    { value: 'female', label: "Female" },
    { value: 'noPref', label: "I don't have any preference" },

  ];

  const handleProvidesTempHousingChange = (e, action) => {
    setShowCapacityDetails(e.target.value === 'yes');
    action({values: { ...initialValues, providesTempHousing: e.target.value}}); 
  }; 

  return (
    <Formik
      innerRef={innerRef}
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, resetForm, values, touched, errors }) => (

        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="VolunteerHousingCapacityFormProvidesTempHousing">
              <RequiredFieldFormLabel>Are you willing to provide temporary housing?</RequiredFieldFormLabel>
              <Form.Select
                name='providesTempHousing'
                onChange={(e) => {handleChange(e); handleProvidesTempHousingChange(e, resetForm);}}
                value={values.providesTempHousing}
                isValid={touched.providesTempHousing && !errors.providesTempHousing}
                isInvalid={touched.providesTempHousing && !!errors.providesTempHousing}
                disabled={formReadOnly}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.providesTempHousing}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { showCapacityDetails ? <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="VolunteerHousingCapacityFormHomeAddress">
                <RequiredFieldFormLabel>If yes, what is your home address (please provide street with number, city, and zip)</RequiredFieldFormLabel>
                    <Form.Control
                    name='homeAddress'
                    value={values.homeAddress}
                    onChange={handleChange}
                    isValid={touched.homeAddress && !errors.homeAddress}
                    isInvalid={touched.homeAddress && !!errors.homeAddress}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.homeAddress}
                    </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerHousingCapacityFormNumMaxStudentsHosted">
                    <Form.Label>How many students could you host at the same time?</Form.Label>
                    <Form.Control
                    type="number"
                    name='numMaxStudentsHosted'
                    value={values.numMaxStudentsHosted}
                    onChange={handleChange}
                    isValid={touched.numMaxStudentsHosted && !errors.numMaxStudentsHosted}
                    isInvalid={touched.numMaxStudentsHosted && !!errors.numMaxStudentsHosted}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numMaxStudentsHosted}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerHousingCapacityFormTempHousingStartDate">
                    <Form.Label>Temp housing is available from date</Form.Label>
                    <Form.Control
                    type="date"
                    name='tempHousingStartDate'
                    value={values.tempHousingStartDate}
                    onChange={handleChange}
                    isValid={touched.tempHousingStartDate && !errors.tempHousingStartDate}
                    isInvalid={touched.tempHousingStartDate && !!errors.tempHousingStartDate}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.tempHousingStartDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerHousingCapacityFormtempHousingEndDate">
                    <Form.Label>Temp housing is available to date</Form.Label>
                    <Form.Control
                    type="date"
                    name='tempHousingEndDate'
                    value={values.tempHousingEndDate}
                    onChange={handleChange}
                    isValid={touched.tempHousingEndDate && !errors.tempHousingEndDate}
                    isInvalid={touched.tempHousingEndDate && !!errors.tempHousingEndDate}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.tempHousingEndDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerHousingCapacityFormNumDoubleBeds">
                    <Form.Label>No. of double bed (use a number from 0 - 9)</Form.Label>
                    <Form.Control
                    type="number"
                    name='numDoubleBeds'
                    value={values.numDoubleBeds}
                    onChange={handleChange}
                    isValid={touched.numDoubleBeds && !errors.numDoubleBeds}
                    isInvalid={touched.numDoubleBeds && !!errors.numDoubleBeds}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numDoubleBeds}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="VolunteerHousingCapacityFormNumSingleBeds">
                  <Form.Label>No. of single bed (use a number from 0 - 9)</Form.Label>
                  <Form.Control
                  type="number"
                  name='numSingleBeds'
                  value={values.numSingleBeds}
                  onChange={handleChange}
                  isValid={touched.numSingleBeds && !errors.numSingleBeds}
                  isInvalid={touched.numSingleBeds && !!errors.numSingleBeds}
                  readOnly={formReadOnly}
                  disabled={formReadOnly}
                  />
                  <Form.Control.Feedback type="invalid">
                  {errors.numSingleBeds}
                  </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="VolunteerHousingCapacityFormGenderPreference">
                <Form.Label>Preference of male or female student</Form.Label>
                <Form.Select
                  name='genderPreference'
                  onChange={handleChange}
                  value={values.genderPreference}
                  isValid={touched.genderPreference && !errors.genderPreference}
                  isInvalid={touched.genderPreference && !!errors.genderPreference}
                  readOnly={formReadOnly}
                  disabled={formReadOnly}
                >
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.genderPreference}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="VolunteerHousingCapacityFormProvidesRide">
                <Form.Label>Could you provide ride to and from campus for students?</Form.Label>
                <Form.Select
                  name='providesRide'
                  onChange={handleChange}
                  value={values.providesRide}
                  isValid={touched.providesRide && !errors.providesRide}
                  isInvalid={touched.providesRide && !!errors.providesRide}
                  disabled={formReadOnly}
                >
                  {yesOrNoOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.providesRide}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </>: null}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="VolunteerHousingCapacityFormTempHousingComment">
              <Form.Label>Do you have any tempHousingComment or special needs (Maximum 500 characters):</Form.Label>
              <Form.Control
                 as="textarea"
                 rows={3}
                name='tempHousingComment'
                value={values.tempHousingComment}
                onChange={handleChange}
                isValid={touched.tempHousingComment && !errors.tempHousingComment}
                isInvalid={touched.tempHousingComment && !!errors.tempHousingComment}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tempHousingComment}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default VolunteerHousingCapacityForm;