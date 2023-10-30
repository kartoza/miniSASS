import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ContactFormData } from '../../components/ContactFormModal/types';
import { Button } from "../../components";
import Modal from 'react-modal';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData); // Log form data
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
    onClose(); // Close the modal after submitting
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
          width: '605px',
          height: '587px',
          borderRadius: '0px 25px 25px 25px',
          border: 'none',
          background: 'none',
          padding: 0,
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
            width: '605px',
            height: '587px',
            background: '#FFFFFF',
            borderRadius: '0px 25px 25px 25px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '10px',
              width: '541px',
              height: '33px',
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
                flex: '1',
              }}
            >
              Contact Form
            </h3>
            <button
              onClick={onClose}
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
          alignItems: 'flex-start',
          gap: '6px',
          width: '541px',
        }}
      >
        <label
          style={{
            width: '10em',
            height: '1.5em',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '1.2em',
            lineHeight: '2em',
            color: '#424242',
          }}
        >
          Your Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 12px',
            gap: '10px',
            width: '541px',
            height: '40px',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
          }}
          placeholder="Enter your name"
        />
        <label
          style={{
            width: '10em',
            height: '1.5em',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '1.2em',
            lineHeight: '2em',
            color: '#424242',
          }}
        >
              Your Email
            </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 12px',
            gap: '10px',
            width: '541px',
            height: '40px',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
          }}
          placeholder="Enter your email"
        />
        <label
          style={{
            width: '10em',
            height: '1.5em',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '1.2em',
            lineHeight: '2em',
            color: '#424242',
          }}
        >
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 12px',
            gap: '10px',
            width: '541px',
            height: '40px',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
          }}
          placeholder="Enter your phone number"
        />
        <label
          style={{
            width: '10em',
            height: '1.5em',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '1.2em',
            lineHeight: '2em',
            color: '#424242',
          }}
        >
          Your Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '8px 12px',
            gap: '10px',
            width: '541px',
            height: '123px',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
          }}
          placeholder="Enter your message"
        />
      </form>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px',
              width: '541px',
              height: '37px',
            }}
          >
            <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ContactFormModal;
