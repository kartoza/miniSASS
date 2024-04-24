import React from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

import { Img, Text } from "../../components";
import ContactFormModal from '../../components/ContactFormModal';
import { useState } from 'react';
import { ContactFormData } from '../../components/ContactFormModal/types';
import { globalVariables } from "../../utils";

type FooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<{
    showLogo?: boolean;
  }>;

const Footer: React.FC<FooterProps> = (props) => {
  const hideLogo = props.showLogo === false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (formData: ContactFormData) => {
    closeModal();
  };

  let className = "flex flex-col md:gap-10 gap-28 items-center justify-center mt-2.5 w-full mt-[-75px]";
  if (hideLogo) {
    className = "flex flex-col md:gap-10 gap-28 items-center justify-center mt-2.5 w-full mt-[230px] mb-[-10px]";
  }

  return (
    <>
      <footer className={props.className}>
        <div className={className}>
          {!hideLogo &&
            <>
              <div
              className="flex flex-row md:gap-10 gap-[67px] items-center justify-center sm:overflow-auto w-auto md:w-full"
              style={{marginLeft: '-5%'}}>
              <a href="https://www.groundtruth.co.za" target="_blank" rel="noopener noreferrer">
                <Img
                  className="h-[100px] md:h-auto object-contain"
                  src={`${globalVariables.staticPath}img_image6.jpg`}
                  alt="Ground Truth"
                />
              </a>
              <a href="https://www.unicef.org/" target="_blank" rel="noopener noreferrer">
                <Img
                  className="h-[100px] md:h-auto object-contain"
                  src={`${globalVariables.staticPath}patners_logo_5.png`}
                  alt="Unicef"
                />
              </a>
                <a href="https://www.cgiar.org" target="_blank" rel="noopener noreferrer">
                <Img
                  className="h-[100px] md:h-auto object-contain"
                  src={`${globalVariables.staticPath}patners_logo_4.png`}
                  alt="CGIAR"
                />
              </a>
              <a href="https://www.iwmi.cgiar.org" target="_blank" rel="noopener noreferrer">
                <Img
                  className="h-[100px] md:h-auto object-contain"
                  src={`${globalVariables.staticPath}patners_logo_2.png`}
                  alt="IWMI"
                />
              </a>
            </div>
            <div
              className="flex flex-row md:gap-10 gap-[67px] items-center justify-center sm:overflow-auto w-auto md:w-full mt-[-75px]"
              style={{marginLeft: '-5%'}}>
              <a href="https://www.wrc.org.za/" target="_blank" rel="noopener noreferrer">
                <Img
                  className="h-[100px] md:h-auto object-contain"
                  src={`${globalVariables.staticPath}patners_logo_6.jpg`}
                  alt="Water Research Commission"
                />
              </a>
              <a href="https://wessa.org.za/" target="_blank" rel="noopener noreferrer">
                <Img
                  className="h-[100px] md:h-auto object-contain"
                  src={`${globalVariables.staticPath}patners_logo_8.png`}
                  alt="Wildlife and Environment Society of South Africa (WESSA)"
                />
              </a>
              <a href="https://kartoza.com/" target="_blank" rel="noopener noreferrer">
                <Img
                  className="h-[100px] md:h-auto object-contain"
                  src={`${globalVariables.staticPath}patners_logo_7.png`}
                  alt="Kartoza"
                />
              </a>
              <a href="https://kartoza.com/" target="_blank" rel="noopener noreferrer">
                <Img
                  className="h-[100px] md:h-auto object-contain"
                  src={`${globalVariables.staticPath}uMngeni-uThukela_ logo.jpg`}
                  alt="uMngeni-uThukela"
                />
              </a>
            </div>
            </>
          }

          <div className="bg-blue-900 flex flex-col items-center justify-end p-6 sm:px-5 rounded-tl-[65px]
            md:w-[105%] sm:w-[110%] w-full mt-[-75px] sm:mt-[-5px] mb-[-10px]">
            <div className="flex flex-col items-center justify-start mt-8 w-[85%] md:w-full">
              <div className="flex flex-col gap-10 items-center justify-start w-auto md:w-full">
                <div className="bg-transparent flex flex-col items-start justify-start w-auto">
                  <Img
                    className="h-[39px] md:h-auto object-cover w-[246px] sm:w-full"
                    src={`${globalVariables.staticPath}replacement_logo.png`}
                    alt="minisasstextLogo"
                  />
                </div>

                <ul className="flex sm:flex-col flex-row gap-[19px] items-start justify-start w-auto md:w-full common-column-list md:ml-[50px]">
                  <li style={{ whiteSpace: 'nowrap' }}>
                    <HashLink to="/howto#howto-title">
                      <Text
                        className="text-sm text-white-A700 tracking-[0.98px] uppercase cursor-pointer"
                        size="txtRalewayExtraBold14WhiteA700"
                      >
                        How to
                      </Text>
                    </HashLink>
                  </li>
                  <li style={{ whiteSpace: 'nowrap' }}>
                    <Text
                      className="text-sm text-white-A700 tracking-[0.98px] uppercase cursor-pointer"
                      size="txtRalewayExtraBold14WhiteA700"
                      onClick={() => navigate("/map")}
                    >
                      Map
                    </Text>
                  </li>
                  <li style={{ whiteSpace: 'nowrap' }}>
                    <Text
                      className="text-sm text-white-A700 tracking-[0.98px] uppercase cursor-pointer"
                      size="txtRalewayExtraBold14WhiteA700"
                      onClick={() => window.open('https://kartoza.github.io/miniSASS/', "_blank")}
                    >
                      Documentation
                    </Text>
                  </li>
                  <li style={{ whiteSpace: 'nowrap' }}>
                    <a>
                      <Text
                        className="text-sm text-white-A700 tracking-[0.98px] uppercase cursor-pointer"
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

                <div className="bg-transparent flex flex-col items-start justify-start w-auto">
                  <a href="https://www.youtube.com/@groundtruthcitizenscience" target="_blank" rel="noopener noreferrer">
                    <Img
                      className="h-6 w-6"
                      src={`${globalVariables.staticPath}img_riyoutubefill_white_a700.svg`}
                      alt="riyoutubefill_One"
                    />
                  </a>
                </div>

                <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between max-w-[1180px] w-full">
                  <Text
                    className="text-base text-white-A700 w-auto"
                    size="txtRalewayRomanRegular16WhiteA700"
                  >
                    <span className="text-white-A700 font-raleway text-left font-normal">
                      © International Water Management Institute (IWMI) and UNICEF.
                    </span>
                  </Text>
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
