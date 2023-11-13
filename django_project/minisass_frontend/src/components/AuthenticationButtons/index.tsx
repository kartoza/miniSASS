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

  // Get the current URL using window.location.href
  const currentURL = window.location.href;

  // Extract the base URL (everything up to the first single forward slash '/')
  const parts = currentURL.split('/');
  const baseUrl = parts[0] + '//' + parts[2]; // Reconstruct the base URL
  
  // Define the replacement path
  const replacementPath = 'static/images/';
  
  // Construct the new URL with the replacement path
  const newURL = baseUrl + '/' + replacementPath;
  const LOGIN_API = baseUrl + '/authentication/api/login/';
  const REGISTRATION_API = baseUrl + '/authentication/api/register/';

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    // Clear the stored state in local storage
    localStorage.removeItem('authState');
  };

  const handleLogin = async (loginData: any) => {
    try {
      const response = await axios.post(`${LOGIN_API}`, loginData, {
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
    const apiUrl = `${REGISTRATION_API}`;
  
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

  return (
    <div className="sm:bottom-20 md:bottom-[119px] flex sm:flex-col flex-row md:gap-10 sm:h-[] items-start justify-between md:left-[50px] md:relative sm:right-[] md:right-[] sm:top-[] md:w-[90%] w-full">
      <Img
        className="sm:bottom-[] h-[29px] sm:h-[50px] md:h-auto sm:mt-0 mt-[21px] object-cover sm:relative sm:top-5"
        src={`${newURL}img_minisasstext1.png`}
        alt="minisasstextOne"
      />
      <div className="flex flex-row gap-px items-start justify-end mb-[15px] rounded-bl-[15px] w-[280px]">
        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            className="sm:bottom-[130px] cursor-pointer font-semibold leading-[normal] left-2.5 sm:left-[105px] relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
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
              className="sm:bottom-[130px] cursor-pointer font-semibold leading-[normal] left-2.5 sm:left-[100px] relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
              shape="square"
              color="blue_900"
              size="xs"
              variant="fill"
            >
              Login
            </Button>
            <Button
              onClick={openRegisterModal}
              className="sm:bottom-[130px] cursor-pointer font-semibold leading-[normal] left-2.5 sm:left-[105px] relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
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
