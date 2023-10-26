import * as React from 'react';
import { Button, Img, Text } from "../../components";
import AuthenticationButtons from '../../components/AuthenticationButtons';
import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";




function NavigationBar(props) {
  const { activePage } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const howToRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    // Close the dropdown when clicking outside of it
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        howToRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !howToRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define a mapping of page names to corresponding button text
  const buttonMapping = {
    home: "Home",
    "how-to": "How to",
    map: "Map",
    downloads: "Downloads",
    patners: "Partners",
    contact: "Contact us",
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

  // Generate the navigation links dynamically based on the active page
  const navigationLinks = Object.keys(buttonMapping).map((page) => (
    <div
      key={page}
      className={`flex sm:flex-1 flex-row gap-px items-center justify-center md:mt-0 mt-[15px] md:relative md:right-[380px] w-auto sm:w-full ${
        activePage === activePage ? "active-link" : ""
      }`}
      onMouseEnter={toggleDropdown}
      onMouseLeave={closeDropdown}
      ref={page === "how-to" ? howToRef : null}
    >
      {
        activePage !== page ? (
          <Link to={`/${page}`} className="text-blue-900 text-sm tracking-[0.98px] uppercase w-auto">
            <Text
              size="txtRalewayExtraBold14"
              className={`text-blue-900 text-sm tracking-[0.98px] uppercase w-auto active-link`}
            >
              {buttonMapping[page]}
            </Text>
          </Link>
        ) : (
          <Button
            className="cursor-pointer font-extrabold leading-[normal] min-w-[85px] text-center text-sm tracking-[0.98px] uppercase"
            shape="round"
            color="gray_200"
            size="xs"
            variant="fill"
          >
            {buttonMapping[page]}
          </Button>
        )
      }
    </div>
  ));

  return (
    <div className="flex flex-col gap-2 items-center justify-start mb-1.5 w-[93%] md:w-full">
                  <div className="sm:bottom-[100px] md:bottom-[180px] flex sm:flex-col flex-row md:gap-10 items-start justify-between sm:left-[50px] md:left-[75px] md:relative md:right-[] sm:top-[] md:w-[90%] w-full">
                    <AuthenticationButtons /> 
                  </div>
                  

                  <div className="md:bottom-[120px] sm:bottom-[135px] flex md:flex-col flex-row md:gap-10 md:h-[] items-end justify-between md:relative md:top-[] w-full">
                    {/* {navigationLinks} */}
                      <div className="flex sm:flex-1 flex-row gap-px items-center justify-center md:mt-0 mt-[15px] md:relative md:right-[380px] w-auto sm:w-full">
                        <Button
                          className="cursor-pointer font-extrabold leading-[normal] min-w-[85px] text-center text-sm tracking-[0.98px] uppercase"
                          shape="round"
                          color="gray_200"
                          size="xs"
                          variant="fill"
                        >
                          Home
                        </Button>
                        <Button
                          className="common-pointer bg-transparent cursor-pointer font-extrabold leading-[normal] min-w-[102px] text-blue-900 text-center text-sm tracking-[0.98px] uppercase"
                          onClick={() => navigate("/howto")}
                          size="xs"
                        >
                          How to
                        </Button>
                        <Button
                          className="common-pointer bg-transparent cursor-pointer font-extrabold leading-[normal] min-w-[73px] text-blue-900 text-center text-sm tracking-[0.98px] uppercase"
                          onClick={() => navigate("/map")}
                          size="xs"
                        >
                          Map
                        </Button>
                        <div className="flex flex-col items-center justify-center px-5 py-[7px] w-auto">
                          <a
                            href="javascript:"
                            className="text-blue-900 text-sm tracking-[0.98px] uppercase w-auto"
                          >
                            <Text size="txtRalewayExtraBold14">Contact us</Text>
                          </a>
                        </div>
                      </div>
                      <div className="flex md:flex-1 flex-row gap-[37px] items-center justify-between w-[22%] md:w-full">
                        <div className="flex flex-row gap-4 items-start justify-start w-auto">
                          <Img
                            className="h-6 w-6"
                            src={`${newURL}img_icbaselinefacebook.svg`}
                            alt="icbaselinefaceb"
                          />
                          <Img
                            className="h-6 w-6"
                            src={`${newURL}img_riyoutubefill.svg`}
                            alt="riyoutubefill"
                          />
                          <Img
                            className="h-6 w-6"
                            src={`${newURL}img_formkitwordpress.svg`}
                            alt="formkitwordpres"
                          />
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
