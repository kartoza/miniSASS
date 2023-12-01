import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Modal from 'react-modal';
import { Button , Img} from "../../components";
import Select from "react-select";
import CountrySelector from "../../components/Countries/selector";
import { COUNTRIES } from "../../components/Countries/countries";
import { SelectMenuOption } from "../../components/Countries/types";
import { globalVariables } from '../../utils';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';


interface RegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationFormData) => void;
  error_response: string | null | boolean;
  Registrationloading: boolean;
  registrationInProgress: boolean;
  setLoading: (newValue: boolean) => void;
  setRegistrationInProgress: (newValue: boolean) => void;
}

interface RegistrationFormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  organizationType: string;
  organizationName: string;
  country: string;
  password: string;
  confirmPassword: string;
}

const RegistrationFormModal: React.FC<RegistrationFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  error_response,
  Registrationloading,
  registrationInProgress,
  setLoading,
  setRegistrationInProgress
 }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    name: '',
    surname: '',
    email: '',
    organizationType: '',
    organizationName: '',
    country: 'ZA',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<RegistrationFormData>>({});
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  // Default this to a country's code to preselect it
  const [country, setCountry] = useState<SelectMenuOption["value"]>("ZA");
  const [loading, setLoading] = useState(false);
  const [registrationInProgress, setRegistrationInProgress] = useState(false);

  useEffect(() => {
    if (error_response === false) {
      // Reset form data and close the registration modal
      setFormErrors({});
      setFormData({
        username: '',
        name: '',
        surname: '',
        email: '',
        organizationType: '',
        organizationName: '',
        country: 'ZA',
        password: '',
        confirmPassword: '',
      });
      onClose();
    }
  }, [error_response]);

  const organisationOptions = [
    { value: 'School', label: 'School' },
    { value: 'NGO', label: 'NGO' },
    { value: 'Conservancy', label: 'Conservancy' },
    { value: 'Private Individual', label: 'Private Individual' },
    { value: 'Government Department', label: 'Government Department' },
    { value: 'Consultancy', label: 'Consultancy' },
    { value: 'University', label: 'University' },
    { value: 'Other', label: 'Other' },
  ]

  const customStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      borderRadius: '4px',
      width: '16.5vw',
      borderColor: isFocused ? '#539987' : 'rgba(0, 0, 0, 0.23)',
      
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused ? '#539987' : 'transparent',
      color: isFocused ? 'white' : 'black',
    }),
    menu: (styles) => ({
      ...styles,
      width: '16.5vw',
    }),
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

 
  const handleEmailBlur = () => {
    if (formData.email) {
      if (!validateEmail(formData.email)) {
        setFormErrors({ ...formErrors, email: 'Invalid email address' });
      }
    }
  };

  const handlePasswordBlur = () => {
    if (formData.password && formData.confirmPassword) {
      if (!validatePassword(formData.password, formData.confirmPassword)) {
        setFormErrors({ ...formErrors, password: 'Passwords do not match' });
      }
    }
  };

  const validateForm = () => {
    const errors: Partial<RegistrationFormData> = {};

    // Validate email when it loses focus
    if (!formData.email) {
      errors.email = 'This field is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email address';
    }

    // Validate passwords when they lose focus
    if (!formData.password) {
      errors.password = 'This field is required';
    } else if (!validatePassword(formData.password, formData.confirmPassword)) {
      errors.password = 'Passwords do not match';
    }

    // Check for other required fields
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.surname) {
      errors.surname = 'Surname is required';
    }
    if (!formData.organizationType) {
      errors.organizationType = 'Organization Type is required';
    }
    if (!formData.organizationName) {
      errors.organizationName = 'Organization Name is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormErrors({});
      setFormData({
        username: '',
        name: '',
        surname: '',
        email: '',
        organizationType: '',
        organizationName: '',
        country: 'ZA',
        password: '',
        confirmPassword: '',
      });
      setLoading(false)
      setRegistrationInProgress(false)
    }
  };

  // Use the effect to set the user's country based on geolocation
  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Get user's latitude and longitude
          const { latitude, longitude } = position.coords;

          // Use reverse geocoding to get the country based on coordinates
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.address && data.address.country_code) {
                const userCountryCode = data.address.country_code.toUpperCase();
                setCountry(userCountryCode);
              }
            })
            .catch((error) => {
              console.error('Error fetching user location:', error);
            });
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Set default country ,if geoLocation fails
          setCountry('ZA');
        }
      );
    }
  }, [isOpen]);

  


  return (
    <>
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '43vw',
          background: 'white',
          border: 'none',
          borderRadius: '0px 25px 25px 25px',
        },
      }}
    >
      {Registrationloading ? (
        // <CircularProgress style={{ margin: '20px' , color: '#288b31' }}/>
        <LinearProgress color="success" />
      ) : registrationInProgress ? (
        <div>
          <h3
              style={{
                fontFamily: 'Raleway',
                fontStyle: 'normal',
                fontWeight: 700,
                alignItems: 'flex-start',
                fontSize: '24px',
                lineHeight: '136.4%',
                color: '#539987',
              }}
            >
              Registration in progress
            </h3>
            <br />
          <Typography>
            To finish registration, please click on the activation link sent to the email you registered with.
          </Typography>

          <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              style={{ marginLeft: "60%" }}
              onClick={onClose}
            >
              Ok
            </Button>
        </div>
      ) : (
        
      
      isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '32px',
            gap: '18px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '55%',
              width: '40vw',
              height: '33px',
            }}
          >
            <h3
              style={{
                fontFamily: 'Raleway',
                fontStyle: 'normal',
                fontWeight: 700,
                alignItems: 'flex-start',
                fontSize: '24px',
                lineHeight: '136.4%',
                color: '#539987',
              }}
            >
              Registration Form
            </h3>
            <Img
                className="h-6 w-6 common-pointer"
                src={`${globalVariables.staticPath}img_icbaselineclose.svg`}
                alt="close"
                onClick={onClose}
                style={{marginLeft: '30px'}}
              />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
              <div style={{ flex: 1, flexDirection: 'column' }}>
                <label>Username:</label><br />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  style={{ borderRadius: '4px', width: '16.5vw' }}
                />
                {formErrors.username && <span style={{ color: 'red' }}>{formErrors.username}</span>}
              </div>
              <div style={{ flex: 1, flexDirection: 'column' }}>
                <label>Email:</label><br />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                  placeholder="Email"
                  style={{ borderRadius: '4px', width: '16.5vw' }}
                />
                {formErrors.email && <span style={{ color: 'red' }}>{formErrors.email}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
              <div style={{ flex: 1, flexDirection: 'column' }}>
                <label>Name:</label><br />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  style={{ borderRadius: '4px', width: '16.5vw' }}
                />
                {formErrors.name && <span style={{ color: 'red' }}>{formErrors.name}</span>}
              </div>
              <div style={{ flex: 1, flexDirection: 'column' }}>
                <label>Surname:</label><br />
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder="Surname"
                  style={{ borderRadius: '4px', width: '16.5vw' }}
                />
                {formErrors.surname && <span style={{ color: 'red' }}>{formErrors.surname}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
              <div style={{ flex: 1, flexDirection: 'column' }}>
                <label>Organisation Name:</label><br />
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  placeholder="Organization Name"
                  style={{ borderRadius: '4px', width: '16.5vw' }}
                />
                {formErrors.organizationName && <span style={{ color: 'red' }}>{formErrors.organizationName}</span>}
              </div>
              <div style={{ flex: 1, flexDirection: 'column',height:'20px'}}>
                <label>Organisation Type:</label>
                <br />
                <Select
                  name="organizationType"
                  placeholder="Select an organization type..."
                  value={organisationOptions.find(option => option.value === formData.organizationType)}
                  onChange={(selectedOption) => {
                    setFormErrors({ ...formErrors, organizationType: '' });
                    setFormData({ ...formData, organizationType: selectedOption.value });
                  }}
                  options={organisationOptions}
                  styles={customStyles}
                />
                {formErrors.organizationType && <span style={{ color: 'red' }}>{formErrors.organizationType}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
              <div style={{ flex: 1, flexDirection: 'column' }}>
                <label>Password:</label><br />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handlePasswordBlur}
                  placeholder="Password"
                  style={{ borderRadius: '4px', width: '16.5vw' }}
                />
                {formErrors.password && <span style={{ color: 'red' }}>{formErrors.password}</span>}
              </div>
              <div style={{ flex: 1, flexDirection: 'column' }}>
                <label>Confirm Password:</label><br />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handlePasswordBlur}
                  placeholder="Confirm Password"
                  style={{ borderRadius: '4px', width: '16.5vw' }}
                />
                {formErrors.confirmPassword && <span style={{ color: 'red' }}>{formErrors.confirmPassword}</span>}
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginLeft: '-54%',
              width: '16.5vw'
            }}>
              <label>Country:</label>
              <CountrySelector
                id={"country-selector"}
                open={isCountrySelectorOpen}
                onToggle={() => setIsCountrySelectorOpen(!isCountrySelectorOpen)}
                onChange={setCountry}
                selectedValue={COUNTRIES.find((option) => option.value === country)}
              />
              {formErrors.country && <span style={{ color: 'red' }}>{formErrors.country}</span>}
            </div>
            {error_response && (
              <div style={{ color: 'red' }}>{error_response}</div>
            )}
            <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              style={{ marginRight: "-80%" }}
              onClick={handleSubmit}
            >
              Register
            </Button>
          </form>
        </div>
      )
      )}
    </Modal>
  </>
  );
};

export default RegistrationFormModal;
