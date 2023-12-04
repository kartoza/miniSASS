import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ContactFormData } from '../../components/ContactFormModal/types';
import { Button ,Img } from "../../components";
import Modal from 'react-modal';
import axios from 'axios'
import { globalVariables } from '../../utils';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const initialState: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  const [formData, setFormData] = useState<ContactFormData>(initialState);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [showHeading, setShowHeading] = useState<boolean>(true);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    SendContactUsEmail(formData)
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };;


  const CONTACT_US_API = globalVariables.baseUrl + '/authentication/api/contact-us'

  const SendContactUsEmail = async (formData) => {

    try {
      const response = await axios.post(CONTACT_US_API, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setResponseMessage('Email sent. Hang in there, we will contact you back soon.');
        setIsError(false);
        setShowHeading(false);
      } else {
        setIsError(true);
        setShowHeading(false);
        setResponseMessage(JSON.stringify(response.data));
      }
    } catch (error) {
      setIsError(true);
      setShowHeading(false);
      setResponseMessage(error.message);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setShowHeading(true);
    setResponseMessage(null);
    setIsError(false);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const isFormValid = (): boolean => {
    return formData.phone.length >= 10 && /\S+@\S+\.\S+/.test(formData.email) && formData.message.trim().length > 0;
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
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
          background: 'white',
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
            background: 'white',
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
              {isError ? (
                <div className="bg-red-100 text-red-600 p-1 rounded">{responseMessage}</div>
              ) : (
                showHeading ? (
                  <div>Contact Form</div>
                ) : (
                  <div className="bg-green-100 text-green-600 p-1 rounded">{responseMessage}</div>
                )
              )}
            </h3>
            <Img
                className="h-6 w-6 common-pointer"
                src={`${globalVariables.staticPath}img_icbaselineclose.svg`}
                alt="close"
                onClick={handleCloseModal}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
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
        {showHeading && (
              <label>
                Your Name:
              </label>
        )}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          style={{
            width: '541px',
            height: '40px',
            borderRadius: '4px',
          }}
          placeholder="Enter your name"
        />
        <label>
              Your Email:
            </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          style={{
            width: '541px',
            height: '40px',
            borderRadius: '4px',
          }}
          placeholder="Enter your email"
        />
        <label>
          Phone Number:
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          style={{
            width: '541px',
            height: '40px',
            borderRadius: '4px',
          }}
          placeholder="Enter your phone number"
        />
        <label>
          Your Message:
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          style={{
            minHeight: '123px',
            width: '541px',
            height: '123px',
            borderRadius: '4px',
          }}
          placeholder="Enter your message"
        />
      </form>
          {/* Button with disabled attribute based on form validity */}
          <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px',
                width: '541px',
                height: '37px'
              }}
            >
              <Button
                className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
                color="blue_gray_500"
                size="xs"
                variant="fill"
                onClick={handleSubmit}
                disabled={!isFormValid()} // Disable button if form is invalid
                style={{ opacity: isFormValid() ? 1 : 0.5 }} // Reduce opacity when disabled
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
