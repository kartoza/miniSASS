import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Modal from 'react-modal';
import { Button , Img} from "../../components";
import Select from "react-select";
import CountrySelector from "../../components/Countries/selector";
import { COUNTRIES } from "../../components/Countries/countries";
import { SelectMenuOption } from "../../components/Countries/types";
import { globalVariables } from '../../utils';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import axios from "axios";
import {useAuth} from "../../AuthContext";
import Checkbox from '@mui/material/Checkbox';
import DownloadIcon from '@mui/icons-material/Download';


interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  error_response: string | null | boolean;
  Registrationloading: boolean;
  registrationInProgress: boolean;
  updatePassword?: boolean;
  defaultFormData?: FormData;
}

interface FormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  organizationType: string;
  organizationName: string;
  country: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
  updatePassword: boolean;
  certificate: any
}

const UPDATE_PROFILE = globalVariables.baseUrl + '/authentication/api/user/update'

const UserFormModal: React.FC<FormModalProps> = ({
  isOpen, 
  onClose, 
  onSubmit,
  error_response,
  Registrationloading,
  registrationInProgress,
  updatePassword,
  defaultFormData
 }) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData ? defaultFormData : {
    username: '',
    name: '',
    surname: '',
    email: '',
    organizationType: '',
    organizationName: '',
    country: 'ZA',
    password: '',
    confirmPassword: '',
    oldPassword: '',
    updatePassword: false,
    certificate: null
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  // Default this to a country's code to preselect it
  const [country, setCountry] = useState<SelectMenuOption["value"]>("ZA");
  const [certificate, setCertificate] = useState<string | null>(null);
  console.debug(certificate)
  const { dispatch, state  } = useAuth();

  const fetchUserDetail = async () => {
    const headers = { 'Authorization': `Bearer ${state.user.access_token}` };
    axios.get(UPDATE_PROFILE, {headers}).then((response) => {
      if (response.data) {
        const newFormData = {
          username: response.data.username,
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
          organizationType: response.data.organisation_type,
          organizationName: response.data.organisation_name,
          country: response.data.country ? response.data.country : 'ZA',
          password: '',
          confirmPassword: '',
          oldPassword: '',
          updatePassword: updatePassword ? updatePassword : false,
          certificate: response.data.certificate
        }
        setCertificate(response.data.certificate)
        setCountry(response.data.country ? response.data.country : 'ZA')
        setFormData(newFormData)
      }
    }).catch((error) => {
        console.log(error)
    })
  }

  useEffect(() => {
    if (isOpen) {
      fetchUserDetail()
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData({ ...formData, updatePassword: updatePassword });
  }, [updatePassword]);


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
        oldPassword: '',
        updatePassword: updatePassword,
        certificate: ''
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

  const handleFileChange = (e: any) => {
    // setFormData({ ...formData, ['certificate']: e.target.files[0] });
    setFormData({ ...formData, 'certificate': e.target.files });
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      const newPassword = { ...formData, [name]: value };

      const remaining = validatePassword(newPassword.password, newPassword.confirmPassword);
      setRemainingRequirements(remaining);


      let errors = [];
      Object.keys(remaining).forEach(function(key, index) {
        if (remaining[key]) {
          errors.push(key);
        }
      });
      setFormErrors({ ...formErrors, [name]: errors.join(',') });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [remainingRequirements, setRemainingRequirements] = useState({
    uppercase: true,
    lowercase: true,
    digit: true,
    specialCharacter: true,
    length: true,
  });

  const validatePassword = (password, confirmPassword) => {
    const requirements = {
      uppercase: /^(?=.*[A-Z])/,
      lowercase: /^(?=.*[a-z])/,
      digit: /^(?=.*\d)/,
      specialCharacter: /^(?=.*[@$!%*?&])/,
      length: /^.{6,}$/,
    };

    const remainingRequirements = {
      uppercase: !requirements.uppercase.test(password),
      lowercase: !requirements.lowercase.test(password),
      digit: !requirements.digit.test(password),
      specialCharacter: !requirements.specialCharacter.test(password),
      length: !requirements.length.test(password),
    };

    return remainingRequirements;
  };

 
  const handleEmailBlur = () => {
    if (formData.email) {
      if (!validateEmail(formData.email)) {
        setFormErrors({ ...formErrors, email: 'Invalid email address' });
      }
    }
  };

  useEffect(() => {
    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ ...formErrors, confirmPassword: 'Passwords do not match.' });
    } else {
      setFormErrors({ ...formErrors, confirmPassword: '' });
    }
  }, [formData.password, formData.confirmPassword]);

  const validateForm = () => {
    const errors: Partial<FormData> = {};

    // Validate email when it loses focus
    if (!formData.email) {
      errors.email = 'This field is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email address';
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
    if (formData.updatePassword) {
      if (!formData.oldPassword) {
        errors.oldPassword = 'Old Password is required';
      }
      if (!formData.password) {
        errors.password = 'Password is required';
      }
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required';
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // if (validateForm() && !Object.values(remainingRequirements).some((requirement) => requirement)) {
    if (validateForm()) {
      onSubmit(formData);
      // setFormErrors({});
    }
  };

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
              Success
            </h3>
            <br />
          <Typography>
            Profile has been successfully updated.
          </Typography>

          <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              style={{ marginLeft: "65%" }}
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
              Update Account
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
              <div style={{ flex: 1, flexDirection: 'column', width: '16.5vw  '}}>
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
              <div style={{ flex: 1, flexDirection: 'column' }}>
                  <label>Certificate:
                  {certificate && <a href={certificate} target={'_blank'}><DownloadIcon /></a>}
                  </label>
                  <br />
                  <input
                    type="file"
                    name="certificate"
                    onChange={handleFileChange}
                    style={{ borderRadius: '4px', width: '16.5vw' }}
                  />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
              <div style={{ flex: 1, flexDirection: 'column', width: '305px' }}>
                  <label>Change Password:</label><br />
                    <Checkbox
                      checked={formData.updatePassword}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({ ...formData, updatePassword: event.target.checked });
                      }}
                    />
                </div>
              {formData.updatePassword ?
                <div style={{ flex: 1, flexDirection: 'column', width: '16.5vw'}}>
                <label>Old Password:</label><br />
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    placeholder="Old Password"
                    style={{ borderRadius: '4px', width: '16.5vw'}}
                  />
                {formErrors.oldPassword && <span style={{ color: 'red' }}>{formErrors.oldPassword}</span>}
                </div> :
                <div style={{ flex: 1, flexDirection: 'column', width: '16.5vw'}}>
                </div>
              }
            </div>
            {formData.updatePassword &&
              <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
                <div style={{ flex: 1, flexDirection: 'column' }}>
                <label>Password:</label><br />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    style={{ borderRadius: '4px', width: '16.5vw' }}
                  />
                <br />
                <div style={{width: '16.5vw'}}>
                {remainingRequirements.uppercase && <span style={{ color: 'red' }}>At least one uppercase letter is required.<br /></span>}
                {remainingRequirements.lowercase && <span style={{ color: 'red' }}>At least one lowercase letter is required.<br /></span>}
                {remainingRequirements.digit && <span style={{ color: 'red' }}>At least one digit is required.<br /></span>}
                {remainingRequirements.specialCharacter && <span style={{ color: 'red' }}>At least one special character is required.<br /></span>}
                {remainingRequirements.length && <span style={{ color: 'red' }}>Password must be at least 6 characters long.<br /></span>}
                {formErrors.password && <span style={{ color: 'red' }}>{formErrors.password}</span>}
                </div>
                </div>
                <div style={{ flex: 1, flexDirection: 'column' }}>
                  <label>Confirm Password:</label><br />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    style={{ borderRadius: '4px', width: '16.5vw' }}
                  />
                  <br />
                  {formErrors.confirmPassword && <span style={{ color: 'red' }}>{formErrors.confirmPassword}</span>}
                </div>
              </div>}

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
              Update
            </Button>
          </form>
        </div>
      )
      )}
    </Modal>
  </>
  );
};

export default UserFormModal;