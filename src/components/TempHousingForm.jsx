import React, { useState } from 'react';
import { Row, Form, Col } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const TempHousingForm = ({ innerRef, onSubmit }) => {
  const { Formik } = formik;

  const [showNumNights, setShowNumNights] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [addressText, setAddressText] = useState('');
  const [showLocationLv2, setShowLocationLv2] = useState(false);
  const [showLocationLv3, setShowLocationLv3] = useState(false);

  const [locationLv2Options, setLocationLv2Options] = useState([{"locationId": '', "locationName": 'Select an option'}]);
  const [locationLv3Options, setLocationLv3Options] = useState([{"dormAppartmentId": '', "dormAppartmentName": 'Select an option'}]);

  const initialValues = {
    needsTempHousing: '',
    numNights: '',
    locationLv1: '',
    locationLv2: '',
    locationLv3: '',
    locationOther: '',
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
    locationOther: yup.string()
      .when(
          ['needsTempHousing','locationLv3'], 
          {
              is: (needsTempHousing, locationLv3) => (needsTempHousing != '' && (typeof locationLv3 === 'undefined' || locationLv3 == '')),
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

  const locationsOptions = [
    {
      "categoryId": '',
      "categoryName": "Select an option",
    },
    {
      "categoryId": 1,
      "categoryName": "On Campus",
      "houseLocations": [
        {
          "locationId": 1,
          "locationName": "East",
          "houseDormApartment": [
            {
              "dormAppartmentId": 1,
              "dormAppartmentName": "Brown-625 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 2,
              "dormAppartmentName": "Cloudman-661 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 3,
              "dormAppartmentName": "Field-711 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 4,
              "dormAppartmentName": "Glenn-118 Bobby Dodd Way"
            },
            {
              "dormAppartmentId": 5,
              "dormAppartmentName": "Hanson-711 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 6,
              "dormAppartmentName": "Harrison-660 Williams St NW"
            },
            {
              "dormAppartmentId": 7,
              "dormAppartmentName": "Hopkins-711 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 8,
              "dormAppartmentName": "Matheson-711 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 9,
              "dormAppartmentName": "Perry-711 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 10,
              "dormAppartmentName": "Smith-630 Williams St NW"
            },
            {
              "dormAppartmentId": 11,
              "dormAppartmentName": "Towers-112 Bobby Dodd Way"
            },
            {
              "dormAppartmentId": 12,
              "dormAppartmentName": "Stein House-733 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 13,
              "dormAppartmentName": "4th Street E-733 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 14,
              "dormAppartmentName": "Hayes House-733 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 15,
              "dormAppartmentName": "Goldin House-733 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 16,
              "dormAppartmentName": "Howell-640 Williams St NW"
            },
            {
              "dormAppartmentId": 17,
              "dormAppartmentName": "Harris-633 Techwood Dr NW"
            },
            {
              "dormAppartmentId": 18,
              "dormAppartmentName": "North Avenue East-120 North Avenue NW"
            }
          ]
        },
        {
          "locationId": 2,
          "locationName": "West",
          "houseDormApartment": [
            {
              "dormAppartmentId": 1,
              "dormAppartmentName": "Armstrong-498 8th St NW"
            },
            {
              "dormAppartmentId": 2,
              "dormAppartmentName": "Caldwell-521 Turner Place NW"
            },
            {
              "dormAppartmentId": 3,
              "dormAppartmentName": "Fitten-855 McMillan St NW"
            },
            {
              "dormAppartmentId": 4,
              "dormAppartmentName": "Folk-531 Turner Place NW"
            },
            {
              "dormAppartmentId": 5,
              "dormAppartmentName": "Freeman-835 McMillan St NW"
            },
            {
              "dormAppartmentId": 6,
              "dormAppartmentName": "Hefner-510 8th St NW"
            },
            {
              "dormAppartmentId": 7,
              "dormAppartmentName": "Montag-845 McMillan St NW"
            },
            {
              "dormAppartmentId": 8,
              "dormAppartmentName": "Center Street North/South-939 Hemphill Ave NW"
            },
            {
              "dormAppartmentId": 9,
              "dormAppartmentName": "Crecine-900 Hemphill Ave NW"
            },
            {
              "dormAppartmentId": 10,
              "dormAppartmentName": "8th Street East/South/West-555 8th St NW"
            },
            {
              "dormAppartmentId": 11,
              "dormAppartmentName": "Fulmer-871 McMillan St NW"
            },
            {
              "dormAppartmentId": 12,
              "dormAppartmentName": "Maulding-501 6th St NW"
            },
            {
              "dormAppartmentId": 13,
              "dormAppartmentName": "6th Street-501 6th St NW"
            },
            {
              "dormAppartmentId": 14,
              "dormAppartmentName": "Undergraduate Living Center-580 Turner Place NW"
            },
            {
              "dormAppartmentId": 15,
              "dormAppartmentName": "Woodruff North/South-890 Curran St NW"
            }
          ]
        },
        {
          "locationId": 4,
          "locationName": "North",
          "houseDormApartment": [
            {
              "dormAppartmentId": 1,
              "dormAppartmentName": "Graduate Living Center (GLC)-301 10th St NW"
            },
            {
              "dormAppartmentId": 2,
              "dormAppartmentName": "10th and Home-251 10th Street NW"
            }
          ]
        }
      ]
    },
    {
      "categoryId": 2,
      "categoryName": "Off Campus",
      "houseLocations": [
        {
          "locationId": 1,
          "locationName": "East",
          "houseDormApartment": [
            {
              "dormAppartmentId": 1,
              "dormAppartmentName": "Biltmore at Midtown-855 West Peachtree St NW"
            },
            {
              "dormAppartmentId": 2,
              "dormAppartmentName": "Solace-710 Peachtree St NE"
            },
            {
              "dormAppartmentId": 3,
              "dormAppartmentName": "Alexander on Ponce-144 Ponce De Leon Ave NE"
            },
            {
              "dormAppartmentId": 4,
              "dormAppartmentName": "100 Midtown-100 10th St NW"
            },
            {
              "dormAppartmentId": 5,
              "dormAppartmentName": "Modera Midtown-95 8th St NW"
            },
            {
              "dormAppartmentId": 6,
              "dormAppartmentName": "Square on Fifth-848 Spring St NW"
            },
            {
              "dormAppartmentId": 7,
              "dormAppartmentName": "The Byron on Peachtree-549 Peachtree St NE"
            },
            {
              "dormAppartmentId": 8,
              "dormAppartmentName": "Hanover West Peachtree-1010 West Peachtree Street NW"
            }
          ]
        },
        {
          "locationId": 2,
          "locationName": "West",
          "houseDormApartment": [
            {
              "dormAppartmentId": 1,
              "dormAppartmentName": "Arium West (formerly Tenside)-1000 Northside Dr NW"
            },
            {
              "dormAppartmentId": 2,
              "dormAppartmentName": "935M-935 Marietta St NW"
            },
            {
              "dormAppartmentId": 3,
              "dormAppartmentName": "M Street-950 Marietta St NW"
            },
            {
              "dormAppartmentId": 4,
              "dormAppartmentName": "Westmar-800 West Marietta St NW"
            }
          ]
        },
        {
          "locationId": 3,
          "locationName": "South",
          "houseDormApartment": [
            {
              "dormAppartmentId": 1,
              "dormAppartmentName": "Centennial Place-526 Centennial Olympic Park Dr"
            }
          ]
        },
        {
          "locationId": 4,
          "locationName": "North",
          "houseDormApartment": [
            {
              "dormAppartmentId": 1,
              "dormAppartmentName": "500 Northside Circle (formerly Hartford)-500 Northside Cir NW"
            },
            {
              "dormAppartmentId": 2,
              "dormAppartmentName": "Highland Ridge-499 Northside Cir NW"
            },
            {
              "dormAppartmentId": 3,
              "dormAppartmentName": "Home Park-"
            },
            {
              "dormAppartmentId": 4,
              "dormAppartmentName": "The Exchange-470 16th St NW"
            },
            {
              "dormAppartmentId": 5,
              "dormAppartmentName": "Element-390 17th St NW"
            },
            {
              "dormAppartmentId": 6,
              "dormAppartmentName": "Alexander at the District-1750 Commerce Dr"
            },
            {
              "dormAppartmentId": 7,
              "dormAppartmentName": "464 Bishop Apartments-464 Bishop St NW"
            },
            {
              "dormAppartmentId": 8,
              "dormAppartmentName": "1016 Lofts-1016 Howell Mill Rd."
            }
          ]
        }
      ]
    }
  ];

  const  handleLocationLv1Change= (e, action) => {
    if(e.target.value != '')
    {
      setShowLocationLv2(true);
      setShowLocationLv3(false);

      const selectedCategory = locationsOptions.filter((category) => category.categoryId == e.target.value);
      const newLocationLv2Options = selectedCategory[0].houseLocations;
      setLocationLv2Options([{"locationId": '', "locationName": 'Select an option'}].concat(newLocationLv2Options));
    }
    else
    {
      setShowLocationLv2(false);
      setShowLocationLv3(false);

      setLocationLv2Options([{"locationId": '', "locationName": 'Select an option'}]);
    }

    setLocationLv3Options([{"dormAppartmentId": '', "dormAppartmentName": 'Select an option'}]);

    action('locationLv2', ''); 
    action('locationLv3', ''); 
  };

  const  handleLocationLv2Change= (e, action) => {
    if(e.target.value != '')
    {
      setShowLocationLv3(true);

      const selectedLocation = locationLv2Options.filter((location) => location.locationId == e.target.value);
      const newLocationLv3Options = selectedLocation[0].houseDormApartment;
      setLocationLv3Options([{"dormAppartmentId": '', "dormAppartmentName": 'Select an option'}].concat(newLocationLv3Options));
    }
    else
    {
      setShowLocationLv3(false);

      setLocationLv3Options([{"dormAppartmentId": '', "dormAppartmentName": 'Select an option'}]);
    }

    action('locationLv3', ''); 
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
            <Form.Group as={Col} controlId="tempHousingFormNeedsTempHousing">
              <RequiredFieldFormLabel>Do you need temporary housing</RequiredFieldFormLabel>
              <Form.Select
                name='needsTempHousing'
                onChange={(e) => {handleChange(e); handleNeedsTempHousingChange(e, resetForm);}}
                value={values.needsTempHousing}
                isValid={touched.needsTempHousing && !errors.needsTempHousing}
                isInvalid={touched.needsTempHousing && !!errors.needsTempHousing}
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
              <Form.Group as={Col} controlId="tempHousingFormNumNights">
                <RequiredFieldFormLabel>If yes, how many nights</RequiredFieldFormLabel>
                <Form.Select
                  name='numNights'
                  onChange={handleChange}
                  value={values.numNights}
                  isValid={touched.numNights && !errors.numNights}
                  isInvalid={touched.numNights && !!errors.numNights}
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
              <Form.Group as={Col} controlId="tempHousingFormLocationLv1">
                <Form.Label>Choose on or off campus first</Form.Label>
                <Form.Select
                    name='locationLv1'
                    onChange={(e) => {handleChange(e); handleLocationLv1Change(e, setFieldValue);}}
                    value={values.locationLv1}
                  >
                    {locationsOptions.map((option) => (
                      <option key={option.categoryId} value={option.categoryId} label={option.categoryName} />
                    ))}
                </Form.Select>
              </Form.Group>
            </Row>
            { showLocationLv2 ? <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="tempHousingFormLocationLv2">
                <Form.Label>Then choose the location</Form.Label>
                <Form.Select
                    name='locationLv2'
                    onChange={(e) => {handleChange(e); handleLocationLv2Change(e, setFieldValue);}}
                    value={values.locationLv2}
                  >
                    {locationLv2Options.map((option) => (
                      <option key={option.locationId} value={option.locationId} label={option.locationName} />
                    ))}
                </Form.Select>
              </Form.Group>
            </Row>
            </> : null }
            { showLocationLv3 ? <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="tempHousingFormLocationLv3">
                <Form.Label>Please choose the dorm/apartment from the list</Form.Label>
                <Form.Select
                    name='locationLv3'
                    onChange={(e) => {handleChange(e); setFieldValue('locationOther', ''); setTouched('locationOther');}}
                    value={values.locationLv3}
                  >
                    {locationLv3Options.map((option) => (
                      <option key={option.dormAppartmentId} value={option.dormAppartmentId} label={option.dormAppartmentName} />
                    ))}
                </Form.Select>
              </Form.Group>
            </Row>
            </> : null }
            <Row className="mb-3">
                <Form.Group as={Col} controlId="tempHousingFormLocationOther">
                    <Form.Label>If you cannot find the address from the above list, please enter the exact address here</Form.Label>
                    <Form.Control
                    name='locationOther'
                    value={values.locationOther}
                    onChange={(e) => {handleChange(e); setFieldValue('locationLv3', '');}}
                    isValid={touched.locationOther && !errors.locationOther}
                    isInvalid={touched.locationOther && !!errors.locationOther}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.locationOther}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
          </> : null }
          { showContact ? <>
            <Row className="mb-3" style={{textDecoration: 'underline'}}>
              <Form.Label>How can we contact the landlord or person living at that address?</Form.Label>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="tempHousingFormContactName">
                    <Form.Label>Contact Name</Form.Label>
                    <Form.Control
                    name='contactName'
                    value={values.contactName}
                    onChange={handleChange}
                    isValid={touched.contactName && !errors.contactName}
                    isInvalid={touched.contactName && !!errors.contactName}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.contactName}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="tempHousingFormContactEmailAddress">
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control
                    type="email"
                    name='contactEmailAddress'
                    value={values.contactEmailAddress}
                    onChange={handleChange}
                    isValid={touched.contactEmailAddress && !errors.contactEmailAddress}
                    isInvalid={touched.contactEmailAddress && !!errors.contactEmailAddress}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.contactEmailAddress}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="tempHousingFormContactPhoneNumber">
                    <Form.Label>Contact Phone</Form.Label>
                    <Form.Control
                    name='contactPhoneNumber'
                    value={values.contactPhoneNumber}
                    onChange={handleChange}
                    isValid={touched.contactPhoneNumber && !errors.contactPhoneNumber}
                    isInvalid={touched.contactPhoneNumber && !!errors.contactPhoneNumber}
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

export default TempHousingForm;