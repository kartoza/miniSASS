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
    <div className="flex flex-col gap-2 items-center justify-start mb-1.5 w-[100%] md:w-full">
      <div className="sm:bottom-[100px] md:bottom-[180px] flex sm:flex-col flex-row md:gap-10 items-start justify-between sm:left-[50px] md:left-[75px] md:relative md:right-[] sm:top-[] md:w-[90%] w-full">
          <AuthenticationButtons /> 
      </div>
                  

      <div className="md:bottom-[120px] sm:bottom-[135px] flex md:flex-col flex-row md:gap-10 md:h-[] items-end justify-between md:relative md:top-[] w-full">
        <div className="flex sm:flex-1 flex-row gap-px items-center justify-center md:mt-0 mt-[15px] md:relative md:right-[380px] w-auto sm:w-full">
          <Button
            className={`common-pointer cursor-pointer font-extrabold leading-[normal] min-w-[102px] text-blue-900 text-center text-sm tracking-[0.98px] uppercase ${
              activePage === 'home' ? 'bg-gray-200' : 'bg-transparent'
            }`}
            shape={activePage === 'home' ? 'round' : 'default'}
            color={activePage === 'home' ? 'gray_200' : 'default'}
            size="xs"
            variant={activePage === 'home' ? 'fill' : 'outline'}
            onClick={() => navigate("/home")}
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

          {/* ContactFormModal opens when isModalOpen is true */}
          <ContactFormModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} />
      </div>


        <div className="flex md:flex-1 flex-row gap-[37px] items-center justify-between w-[22%] md:w-full">
          <div className="flex flex-row gap-4 items-start justify-start w-auto">
            <a href="https://www.facebook.com/mini.sass?fref=ts" target="_blank" rel="noopener noreferrer">
              <Img
                className="h-6 w-6"
                src={`${newURL}img_icbaselinefacebook.svg`}
                alt="icbaselinefaceb"
              />
            </a>
            <a href="https://www.youtube.com/channel/UCub24hwrLi52WR9C24uTbaQ" target="_blank" rel="noopener noreferrer">
              <Img
                className="h-6 w-6"
                src={`${newURL}img_riyoutubefill.svg`}
                alt="riyoutubefill"
              />
            </a>
            <a href="https://minisassblog.wordpress.com" target="_blank" rel="noopener noreferrer">
              <Img
                className="h-6 w-6"
                src={`${newURL}img_formkitwordpress.svg`}
                alt="formkitwordpres"
              />
            </a>
          </div>
          <Img
            className="h-[45px] sm:h-[] md:h-[] object-cover"
            src={`${newURL}img_image3.png`}
            alt="imageThree"
          />
        </div>

                      
      </div>
    </div>
  );
}

export default NavigationBar;
