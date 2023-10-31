import React, { useState } from 'react';
import { Button, Img, Text } from '../../components';
import LoginFormModal from '../../components/LoginFormModal';
import RegistrationFormModal from '../../components/RegistrationFormModal';

function AuthenticationButtons({ isLoggedIn }) {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setRegisterModalOpen(false);
  };

  const handleLogout = () => {
    // Implement your logout functionality here
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
    <div className="sm:bottom-20 md:bottom-[119px] flex sm:flex-col flex-row md:gap-10 sm:h-[] items-start justify-between sm:left-[50px] md:left-[63px] md:relative sm:right-[] md:right-[] sm:top-[] md:w-[100%] w-full">
      <Img
        className="h-[29px] sm:h-[50px] md:h-auto sm:mt-0 mt-[21px] object-cover"
        src={`${newURL}img_minisasstext1.png`}
        alt="minisasstextOne"
      />
      <div className="flex flex-row gap-px items-start justify-end mb-[15px] rounded-bl-[15px] w-[280px]">
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            className="sm:bottom-[125px] cursor-pointer font-semibold leading-[normal] sm:left-[100px] sm:relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
            shape="square"
            color="blue_900"
            size="xs"
            variant="fill"
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              onClick={openLoginModal}
              className="sm:bottom-[125px] cursor-pointer font-semibold leading-[normal] sm:left-[100px] sm:relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
              shape="square"
              color="blue_900"
              size="xs"
              variant="fill"
            >
              Login
            </Button>
            <Button
              onClick={openRegisterModal}
              className="sm:bottom-[125px] cursor-pointer font-semibold leading-[normal] sm:left-[110px] sm:relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
              shape="square"
              color="blue_900"
              size="xs"
              variant="fill"
            >
              Register
            </Button>
          </>
        )}
      </div>
      <LoginFormModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegistrationFormModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
    </div>
  );
}

export default AuthenticationButtons;
