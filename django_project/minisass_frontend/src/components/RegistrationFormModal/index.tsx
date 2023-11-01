import React, { useState, ChangeEvent, FormEvent } from 'react';
import Modal from 'react-modal';
import { Button } from "../../components";

interface RegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationFormData) => void;
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

const RegistrationFormModal: React.FC<RegistrationFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    name: '',
    surname: '',
    email: '',
    organizationType: '',
    organizationName: '',
    country: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      username: '',
      name: '',
      surname: '',
      email: '',
      organizationType: '',
      organizationName: '',
      country: '',
      password: '',
      confirmPassword: '',
    });
    onClose();
  };

  return (
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
      {isOpen && (
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
            <button
              onClick={onClose}
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              X
            </button>
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
              <div style={{ flex: 1,flexDirection: 'column' }}>
                <label>Username:</label><br/>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  style={{borderRadius: '4px',width: '16.5vw'}}
                />
              </div>
              <div style={{ flex: 1,flexDirection: 'column' }}>
                <label>Email:</label><br/>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  style={{borderRadius: '4px',width: '16.5vw'}}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
              <div style={{ flex: 1,flexDirection: 'column' }}>
                <label>Name:</label><br/>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  style={{borderRadius: '4px',width: '16.5vw'}}
                />
              </div>
              <div style={{ flex: 1,flexDirection: 'column' }}>
                <label>Surname:</label><br/>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder="Surname"
                  style={{borderRadius: '4px',width: '16.5vw'}}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
              <div style={{ flex: 1,flexDirection: 'column' }}>
                <label>Organisation Name:</label><br/>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  placeholder="Organization Name"
                  style={{borderRadius: '4px',width: '16.5vw'}}
                />
              </div>
              <div style={{ flex: 1,flexDirection: 'column' }}>
                <label>Organisation Type:</label><br/>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleInputChange}
                  style={{
                    height: '40px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    width: '16.5vw'
                  }}
                >
                  <option value="">Select Organization Type</option>
                  <option value="School">School</option>
                  <option value="NGO">NGO</option>
                  <option value="Conservancy">Conservancy</option>
                  <option value="Private Individual">Private Individual</option>
                  <option value="Government Department">Government Department</option>
                  <option value="Consultancy">Consultancy</option>
                  <option value="University">University</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
              <div style={{ flex: 1 ,flexDirection: 'column'}}>
                <label>Password:</label><br/>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  style={{borderRadius: '4px',width: '16.5vw'}}
                />
              </div>
              <div style={{ flex: 1,flexDirection: 'column' }}>
                <label>Confirm Password:</label><br/>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  style={{borderRadius: '4px',width: '16.5vw'}}
                />
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px' ,
              marginLeft: '-54%'
            }}>
              <label>Country:</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={{borderRadius: '4px',width: '16.5vw'}}
              >
                <option value="">Select Country</option>
                {/* Add country options here */}
              </select>
            </div>
            <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              style={{marginRight: "-70%"}}
              onClick={handleSubmit}
            >
              Register
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default RegistrationFormModal;
