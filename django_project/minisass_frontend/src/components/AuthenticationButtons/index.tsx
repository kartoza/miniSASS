import React, { useState } from 'react';
import { Button, Img } from '../../components';
import LoginFormModal from '../../components/LoginFormModal';
import RegistrationFormModal from '../../components/RegistrationFormModal';
import { useAuth } from '../../AuthContext';
import axios from 'axios';


function AuthenticationButtons() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const { state, dispatch } = useAuth();
  const isAuthenticated = state.isAuthenticated;

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

  const [error, setError] = useState(null); // Define an error state

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    // Clear the stored state in local storage
    localStorage.removeItem('authState');
  };
  const apiBaseUrl = window.location.href.split('/')[2];

  const handleLogin = async (loginData: any) => {
    try {
      const response = await axios.post(`http://${apiBaseUrl}/authentication/api/authentication/api/login/`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        const userData = response.data;
        dispatch({ type: 'LOGIN', payload: userData });
        // Store the state in local storage
        localStorage.setItem('authState', JSON.stringify({ userData }));
        setError(null);
        setLoginModalOpen(false)
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleRegistration = async (registrationData) => {
    const apiUrl = `http://${apiBaseUrl}/authentication/api/register/`;
  
    try {
      const response = await axios.post(apiUrl, registrationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        setError(null)
      } else {
        setError( JSON.stringify(response.data));
      }
    } catch (error) {
      setError(JSON.stringify(error.message));
    }
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
      <div className="flex flex-row gap-px items-start justify-end mb-[15px] rounded-bl-[15px] w-[280px]" >
        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            className="sm:bottom-[125px] cursor-pointer font-semibold leading-[normal] sm:left-[110px] sm:relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
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
      <LoginFormModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onSubmit={handleLogin}  error_response={error}/>
      <RegistrationFormModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} onSubmit={handleRegistration} error_response={error}/>
    </div>
  );
}

export default AuthenticationButtons;
