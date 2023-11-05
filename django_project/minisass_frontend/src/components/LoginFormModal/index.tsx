import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Modal from 'react-modal';
import { Button } from "../../components";

interface LoginFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { username: string; password: string }) => void;
  error_response: string | null;
}

const LoginFormModal: React.FC<LoginFormModalProps> = ({ isOpen, onClose, onSubmit, error_response }) => {
  const [formData, setFormData] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error_response === null) {
      // Close the modal if login is successful
      onClose();
      
    }
  }, [error_response]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      setError(null);
      onSubmit(formData);
      setFormData({ username: '', password: '' });
    } else {
      setError('Please enter both username and password.');
    }
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
          maxWidth: '400px',
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
            alignItems: 'center',
            padding: '32px',
            gap: '18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                fontFamily: 'Raleway',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '136.4%',
                color: '#539987',
                flex: 1, // Expand to take the remaining space
              }}
            >
              Login
            </h3>
            <div
              onClick={onClose}
              style={{
                cursor: 'pointer',
                marginLeft: '100%',
              }}
            >
              X
            </div>
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
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '40px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                padding: '8px 12px',
              }}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '40px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                padding: '8px 12px',
              }}
            />
            {error && (
              <div style={{ color: 'red' }}>{error}</div>
            )}
            {error_response && (
              <div style={{ color: 'red' }}>{error_response}</div>
            )}
            <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              style={{ marginRight: "-40%" }}
              onClick={handleSubmit}
            >
              Login
            </Button>
            <p style={{ textAlign: 'center' }}>
              <span style={{ color: 'gray' }}>Forgot your password? </span>
              <span style={{ color: '#539987' }}>Click here</span>
            </p>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default LoginFormModal;
