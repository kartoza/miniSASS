import React from "react";

import { Img, Text } from "../../components";
import ContactFormModal from '../../components/ContactFormModal';
import { useState } from 'react';
import { ContactFormData } from '../../components/ContactFormModal/types'; 


type FooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<{}>;

const Footer: React.FC<FooterProps> = (props) => {
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
      <footer className={props.className}>
        <div className="flex flex-col md:gap-10 gap-28 items-center justify-center mt-2.5 w-full">
          <div className="flex flex-row md:gap-10 gap-[67px] items-center justify-center sm:overflow-auto w-auto md:w-full" style={{marginLeft: '-5%'}}>
            <Img
              className="h-[100px] md:h-auto object-contain"
              src={`${newURL}img_image6.png`}
              alt="patners"
            />
            <Img
              className="h-[100px] md:h-auto object-contain"
              src={`${newURL}patners_logo_2.png`}
              alt="patners"
            />
            <Img
              className="h-[100px] md:h-auto object-contain"
              src={`${newURL}patners_logo_3.png`}
              alt="patners"
            />
            <Img
              className="h-[100px] md:h-auto object-contain"
              src={`${newURL}patners_logo_4.png`}
              alt="patners"
            />
            <Img
              className="h-[100px] md:h-auto object-contain"
              src={`${newURL}patners_logo_5.png`}
              alt="patners"
            />
          </div>
          <div className="bg-blue-900 flex flex-col items-center justify-end p-6 sm:px-5 rounded-tl-[65px] md:w-[105%] sm:w-[110%] w-full">
            <div className="flex flex-col items-center justify-start mt-8 w-[85%] md:w-full">
              <div className="flex flex-col gap-10 items-center justify-start w-auto md:w-full">
                <div className="bg-transparent flex flex-col items-start justify-start w-auto">
                  <Img
                    className="h-[39px] md:h-auto object-cover w-[246px] sm:w-full"
                    src={`${newURL}replacement_logo.png`}
                    alt="minisasstextLogo"
                  />
                </div>

                <ul className="flex sm:flex-col flex-row gap-[19px] items-start justify-start w-auto md:w-full common-column-list">
                  <li style={{ whiteSpace: 'nowrap' }}>
                    <a href="/howto">
                      <Text
                        className="text-sm text-white-A700 tracking-[0.98px] uppercase"
                        size="txtRalewayExtraBold14WhiteA700"
                      >
                        How to
                      </Text>
                    </a>
                  </li>
                  <li style={{ whiteSpace: 'nowrap' }}>
                    <a href="/map">
                      <Text
                        className="text-sm text-white-A700 tracking-[0.98px] uppercase"
                        size="txtRalewayExtraBold14WhiteA700"
                      >
                        Map
                      </Text>
                    </a>
                  </li>
                  <li style={{ whiteSpace: 'nowrap' }}>
                    <a>
                      <Text
                        className="text-sm text-white-A700 tracking-[0.98px] uppercase"
                        size="txtRalewayExtraBold14WhiteA700"
                        onClick={openModal}
                      >
                        Contact us
                      </Text>
                      
                      {/* ContactFormModal opens when isModalOpen is true */}
                      <ContactFormModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} />
                    </a>
                  </li>
                </ul>


                <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1180px] w-full">
                  <Text
                    className="text-base text-white-A700 w-auto"
                    size="txtRalewayRomanRegular16WhiteA700"
                  >
                    <span className="text-white-A700 font-raleway text-left font-normal">
                      © 2023 Water Research Commission. This is an open source project. Get the source code at{" "}
                    </span>
                    <a
                      href="https://github.com/kartoza/miniSASS"  // GitHub link
                      className="text-white-A700 font-raleway text-left font-normal underline"
                      target="_blank" rel="noopener noreferrer"
                      style={{ marginRight: '5rem' }} // Add this style for spacing
                    >
                      Github
                    </a>
                  </Text>
                  <div className="flex flex-row gap-2.5 items-start justify-start w-auto">
                    <a href="https://www.facebook.com/mini.sass?fref=ts" target="_blank" rel="noopener noreferrer">
                      <Img
                        className="h-6 w-6"
                        src={`${newURL}img_icbaselinefacebook_white_a700.svg`}
                        alt="icbaselinefaceb_One"
                      />
                    </a>
                    <a href="https://www.youtube.com/channel/UCub24hwrLi52WR9C24uTbaQ" target="_blank" rel="noopener noreferrer">
                      <Img
                        className="h-6 w-6"
                        src={`${newURL}img_riyoutubefill_white_a700.svg`}
                        alt="riyoutubefill_One"
                      />
                    </a>
                    <a href="https://minisassblog.wordpress.com" target="_blank" rel="noopener noreferrer">
                      <Img
                        className="h-6 w-6"
                        src={`${newURL}img_formkitwordpress_white_a700.svg`}
                        alt="formkitwordpres_One"
                      />
                    </a>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

Footer.defaultProps = {};

export default Footer;
