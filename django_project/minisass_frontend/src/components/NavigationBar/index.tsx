import * as React from 'react';
import { Button, Img, Text } from "../../components";
import AuthenticationButtons from '../../components/AuthenticationButtons';
import { useNavigate } from "react-router-dom";
import ContactFormModal from '../../components/ContactFormModal';
import { useState } from 'react';
import { ContactFormData } from '../../components/ContactFormModal/types'; 


function NavigationBar(props) {
  const { activePage } = props;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (formData: ContactFormData) => {
    // Handle form submission (formData) here
    console.log(formData);

    // Close the modal after submission
    closeModal();
  };

  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL

  // Define the replacement path
  const replacementPath = 'static/images/';

  // Construct the new URL with the replacement path
  const newURL = baseUrl + '/' + replacementPath;

  return (
    <>
      <AuthenticationButtons />

      <div className="md:bottom-[120px] sm:bottom-[135px] flex md:flex-col flex-row md:gap-10 md:h-[] items-end justify-between md:relative static md:top-[] w-full">
        <div className="flex sm:flex-1 flex-row gap-px items-center justify-center md:mt-0
        mt-[15px] md:relative md:right-[400px] w-auto sm:w-full sm:flex-col sm:ml-[700px] sm:left-[10px]">
          <Button
            className={`common-pointer cursor-pointer font-extrabold leading-[normal] min-w-[102px] text-blue-900 text-center text-sm tracking-[0.98px] uppercase ${
              activePage === 'home' ? 'bg-gray-200' : 'bg-transparent'
            }`}
            shape={activePage === 'home' ? 'round' : 'default'}
            color={activePage === 'home' ? 'gray_200' : 'default'}
            size="xs"
            variant={activePage === 'home' ? 'fill' : 'outline'}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            className={`common-pointer cursor-pointer font-extrabold leading-[normal] min-w-[102px] text-blue-900 text-center text-sm tracking-[0.98px] uppercase ${
              activePage === 'howto' ? 'bg-gray-200' : 'bg-transparent'
            }`}
            shape={activePage === 'howto' ? 'round' : 'default'}
            color={activePage === 'howto' ? 'gray_200' : 'default'}
            size="xs"
            variant={activePage === 'howto' ? 'fill' : 'outline'}
            onClick={() => navigate("/howto")}
          >
            How to
          </Button>
          <Button
            className={`common-pointer cursor-pointer font-extrabold leading-[normal] min-w-[73px] text-blue-900 text-center text-sm tracking-[0.98px] uppercase ${
              activePage === 'map' ? 'bg-gray-200' : 'bg-transparent'
            }`}
            shape={activePage === 'map' ? 'round' : 'default'}
            color={activePage === 'map' ? 'gray_200' : 'default'}
            size="xs"
            variant={activePage === 'map' ? 'fill' : 'outline'}
            onClick={() => navigate("/map")}
          >
            Map
          </Button>
          <Button
            className={`common-pointer cursor-pointer font-extrabold leading-[normal] min-w-[85px] text-blue-900 text-center text-sm tracking-[0.98px] uppercase ${
              activePage === 'contact' ? 'bg-gray-200' : 'bg-transparent'
            }`}
            shape={activePage === 'contact' ? 'round' : 'default'}
            color={activePage === 'contact' ? 'gray_200' : 'default'}
            size="xs"
            variant={activePage === 'contact' ? 'fill' : 'outline'}
            onClick={openModal}
          >
            Contact us
          </Button>

          
          <ContactFormModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} />
      </div>


      <div className="mb-[12px] sticky mr-[-15px]">
          <Button
          onClick={() => navigate('/mobile-app')}
          className="cursor-pointer font-semibold leading-[normal] relative rounded-bl-[15px] rounded-tl-[15px]
          text-base text-center w-full"
          shape="square"
          color="blue_900"
          size="xs"
          variant="fill"
        >
          Download miniSASS App
        </Button>
      </div>

                      
      </div>
    </>
  );
}

export default NavigationBar;
