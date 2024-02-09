import React, { useState, useEffect, useMemo } from 'react';
import { Row, Form, Col } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';


const StudentTempHousingForm = ({ innerRef, onSubmit, optionReferences, loadedData, formReadOnly }) => {
  const { Formik } = formik;

  const [showNumNights, setShowNumNights] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [addressText, setAddressText] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [showApartment, setShowApartment] = useState(false);
  const [locationOptions, setLocationOptions] = useState([{"id": '', "value": 'Select an option'}]);
  const [apartmentOptions, setApartmentOptions] = useState([{"id": '', "value": 'Select an option'}]);

  // Parse optionReferences to build a location hierarchy tree
  const areaReferences = useMemo(() => {
    if(optionReferences.Area != undefined)
    {
      return JSON.parse(JSON.stringify(optionReferences.Area));
    }

    return [];
  }, [optionReferences]);

  const locationReferences = useMemo(() => {
    if(optionReferences.Location != undefined)
    {
      return JSON.parse(JSON.stringify(optionReferences.Location));
    }

    return [];
  }, [optionReferences]);

  const apartmentReferences = useMemo(() => {
    if(optionReferences.Apartment != undefined)
    {
      return JSON.parse(JSON.stringify(optionReferences.Apartment));
    }

    return [];
  }, [optionReferences]);

  const referencesById = useMemo(() => {
    let referencesById = {};

    for (let reference of areaReferences.concat(locationReferences).concat(apartmentReferences)) {
      referencesById[reference.id] = reference;
    }

    return referencesById;
  }, [optionReferences]);

  const locationHierarchy = useMemo(() => {
    for (let reference of locationReferences.concat(apartmentReferences)) {
      let parentId = reference.parentReference.id;
      let parentReference = referencesById[parentId];
      if (!parentReference.children) {
          parentReference.children = [];
      }
      parentReference.children.push(reference);
    }

    return [{id: '', value: 'Select an option'}, ...areaReferences];
  }, [optionReferences]);

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object')
    {
      innerRef.current.setValues(loadedData);
  
      if (loadedData.needsTempHousing == 'yes') {
        setShowNumNights(true);
        setAddressText('Where should we send you to after this period? Address');
      } else if (loadedData.needsTempHousing == 'no') {
        setShowContact(true);
      }

      if (loadedData.apartmentReferenceId !== undefined && loadedData.apartmentReferenceId != '') {
        setShowLocation(true);
        setShowApartment(true);

        if (referencesById[loadedData.apartmentReferenceId] === undefined) {
          return;
        }

        let selectedLocationReference = referencesById[referencesById[loadedData.apartmentReferenceId]?.parentReference?.id];

        if (selectedLocationReference === undefined) {
          return;
        }
        
        if (referencesById[selectedLocationReference.id] === undefined) {
          return;
        }

        let selectedAreaReference = referencesById[referencesById[selectedLocationReference.id]?.parentReference?.id];

        if (selectedAreaReference === undefined) {
          return;
        }

        innerRef.current.setFieldValue('area', selectedAreaReference.id);
        innerRef.current.setFieldValue('location', selectedLocationReference.id);

        const newLocationOptions = selectedAreaReference.children ?? [];
        const newApartmentOptions = selectedLocationReference.children ?? [];
        setLocationOptions([{"id": '', "value": 'Select an option'}].concat(newLocationOptions));
        setApartmentOptions([{"id": '', "value": 'Select an option'}].concat(newApartmentOptions));
      }
    }
  }, [loadedData]);

  const initialValues = {
    needsTempHousing: '',
    numNights: '',
    area: '',
    location: '',
    apartmentReferenceId: '',
    customDestinationAddress: '',
    contactName: '',
    contactEmailAddress: '',
    contactPhoneNumber: '',
  };

  const requiredAlphaNumSpaceTest =  yup.string().required('Required!').matches(/^[a-zA-Z0-9][a-zA-Z0-9, ]*$/, { message: 'Can only contain English letters, numbers, comma(,) and spaces!', excludeEmptyString: true });
  const optionalAlphaSpaceTest =  yup.string().matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const requiredSelectTest = yup.string().required('Required!');
  const emailAddressTest = yup.string().email('Must be a valid email address');
  const phoneNumberTest = yup.string()
    .min(8, 'Too Short!')
    .matches( /^[0-9\+\-\(\) ]*$/, 'Must be a valid phone number' );

  const schema = yup.object().shape({
    needsTempHousing: requiredSelectTest,
    numNights: yup.string().when('needsTempHousing', {is: 'yes', then: () => requiredSelectTest}),
    customDestinationAddress: yup.string()
      .when(
          ['needsTempHousing','apartmentReferenceId'], 
          {
              is: (needsTempHousing, apartmentReferenceId) => (needsTempHousing != '' && (typeof apartmentReferenceId === 'undefined' || apartmentReferenceId == '')),
              then: () => requiredAlphaNumSpaceTest,
          }),
    contactName: optionalAlphaSpaceTest,
    contactEmailAddress: emailAddressTest,
    contactPhoneNumber: phoneNumberTest,
  });


  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes" },
    { value: 'no', label: "No" },
  ];

  const numNightsOptions = [
    { value: '', label: "Select an option" },
    { value: '1', label: "1" },
    { value: '2', label: "2" },
    { value: '3', label: "3" },
    { value: '4', label: "4" },
    { value: '5', label: "5" },
  ];

  const handleAreaChange= (e, action) => {
    if(e.target.value != '')
    {
      setShowLocation(true);
      setShowApartment(false);

      let selectedArea = locationHierarchy.filter((area) => area.id == e.target.value);
      let newLocationOptions = selectedArea[0].children ?? [];
      setLocationOptions([{"id": '', "value": 'Select an option'}].concat(newLocationOptions));
    }
    else
    {
      setShowLocation(false);
      setShowApartment(false);

      setLocationOptions([{"id": '', "value": 'Select an option'}]);
    }

    setApartmentOptions([{"id": '', "value": 'Select an option'}]);

    action('location', ''); 
    action('apartmentReferenceId', ''); 
  };

  const handleLocationChange = (e, action) => {
    if(e.target.value != '')
    {
      setShowApartment(true);

      let selectedLocation = locationOptions.filter((location) => location.id == e.target.value);
      let newApartmentOptions = selectedLocation[0].children ?? [];
      setApartmentOptions([{"id": '', "value": 'Select an option'}].concat(newApartmentOptions));
    }
    else
    {
      setShowApartment(false);

      setApartmentOptions([{"id": '', "value": 'Select an option'}]);
    }

    action('apartmentReferenceId', ''); 
  };

  const handleNeedsTempHousingChange = (e, action) => {
    setShowNumNights(e.target.value == 'yes');
    setShowContact(e.target.value == 'no');

    if(e.target.value == 'yes')
    {
      setAddressText('Where should we send you to after this period? Address');
    }
    else if(e.target.value == 'no')
    {
      setAddressText('If not, where should we drive you to from the airport? Address');
    }

    action({values: { ...initialValues, needsTempHousing: e.target.value}}); 
  };

  return (
    <Formik
      innerRef={innerRef}
      validationSchema={schema}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, resetForm, setFieldValue, setTouched, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="StudentTempHousingFormNeedsTempHousing">
              <RequiredFieldFormLabel>Do you need temporary housing</RequiredFieldFormLabel>
              <Form.Select
                name='needsTempHousing'
                onChange={(e) => {handleChange(e); handleNeedsTempHousingChange(e, resetForm);}}
                value={values.needsTempHousing}
                isValid={touched.needsTempHousing && !errors.needsTempHousing}
                isInvalid={touched.needsTempHousing && !!errors.needsTempHousing}
                disabled={formReadOnly}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.needsTempHousing}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { showNumNights ? <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="StudentTempHousingFormNumNights">
                <RequiredFieldFormLabel>If yes, how many nights</RequiredFieldFormLabel>
                <Form.Select
                  name='numNights'
                  onChange={handleChange}
                  value={values.numNights}
                  isValid={touched.numNights && !errors.numNights}
                  isInvalid={touched.numNights && !!errors.numNights}
                  disabled={formReadOnly}
                >
                  {numNightsOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.numNights}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>    
          </> : null }
          { showNumNights || showContact ? <>
            <Row className="mb-3" style={{textDecoration: 'underline'}}>
              <RequiredFieldFormLabel>{addressText}</RequiredFieldFormLabel>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="StudentTempHousingFormArea">
                <Form.Label>Choose on or off campus first</Form.Label>
                <Form.Select
                    name='area'
                    onChange={(e) => {handleChange(e); handleAreaChange(e, setFieldValue);}}
                    value={values.area}
                    disabled={formReadOnly}
                  >
                    {locationHierarchy.map((option) => (
                      <option key={option.id} value={option.id} label={option.value} />
                    ))}
                </Form.Select>
              </Form.Group>
            </Row>
            { showLocation ? <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="StudentTempHousingFormLocation">
                <Form.Label>Then choose the location</Form.Label>
                <Form.Select
                    name='location'
                    onChange={(e) => {handleChange(e); handleLocationChange(e, setFieldValue);}}
                    value={values.location}
                    disabled={formReadOnly}
                  >
                    {locationOptions.map((option) => (
                      <option key={option.id} value={option.id} label={option.value} />
                    ))}
                </Form.Select>
              </Form.Group>
            </Row>
            </> : null }
            { showApartment ? <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="StudentTempHousingFormApartmentReferenceId">
                <Form.Label>Please choose the dorm/apartment from the list</Form.Label>
                <Form.Select
                    name='apartmentReferenceId'
                    onChange={(e) => {handleChange(e); setFieldValue('customDestinationAddress', ''); setTouched('customDestinationAddress');}}
                    value={values.apartmentReferenceId}
                    disabled={formReadOnly}
                  >
                    {apartmentOptions.map((option) => (
                      <option key={option.id} value={option.id} label={option.value} />
                    ))}
                </Form.Select>
              </Form.Group>
            </Row>
            </> : null }
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentTempHousingFormCustomDestinationAddress">
                    <Form.Label>If you cannot find the address from the above list, please enter the exact address here</Form.Label>
                    <Form.Control
                    name='customDestinationAddress'
                    value={values.customDestinationAddress}
                    onChange={(e) => {handleChange(e); setFieldValue('apartmentReferenceId', '');}}
                    isValid={touched.customDestinationAddress && !errors.customDestinationAddress}
                    isInvalid={touched.customDestinationAddress && !!errors.customDestinationAddress}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.customDestinationAddress}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
          </> : null }
          { showContact ? <>
            <Row className="mb-3" style={{textDecoration: 'underline'}}>
              <Form.Label>How can we contact the landlord or person living at that address?</Form.Label>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentTempHousingFormContactName">
                    <Form.Label>Contact Name</Form.Label>
                    <Form.Control
                    name='contactName'
                    value={values.contactName}
                    onChange={handleChange}
                    isValid={touched.contactName && !errors.contactName}
                    isInvalid={touched.contactName && !!errors.contactName}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.contactName}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentTempHousingFormContactEmailAddress">
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control
                    type="email"
                    name='contactEmailAddress'
                    value={values.contactEmailAddress}
                    onChange={handleChange}
                    isValid={touched.contactEmailAddress && !errors.contactEmailAddress}
                    isInvalid={touched.contactEmailAddress && !!errors.contactEmailAddress}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.contactEmailAddress}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentTempHousingFormContactPhoneNumber">
                    <Form.Label>Contact Phone</Form.Label>
                    <Form.Control
                    name='contactPhoneNumber'
                    value={values.contactPhoneNumber}
                    onChange={handleChange}
                    isValid={touched.contactPhoneNumber && !errors.contactPhoneNumber}
                    isInvalid={touched.contactPhoneNumber && !!errors.contactPhoneNumber}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.contactPhoneNumber}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
          </> : null }
        </Form>
      )}
    </Formik>
  );
};

export default StudentTempHousingForm;