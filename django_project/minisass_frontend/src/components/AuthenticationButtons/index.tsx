import React, { useState, useEffect } from 'react';
import { Button, Img } from '../../components';
import LoginFormModal from '../../components/LoginFormModal';
import RegistrationFormModal from '../../components/RegistrationFormModal';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import { globalVariables } from '../../utils';


function AuthenticationButtons() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const { dispatch, state  } = useAuth();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem('authState');
    if (storedState) {
        const parsedState = JSON.parse(storedState);
        if(parsedState.userData.is_authenticated == 'true')
          setIsAuthenticated(true)
    }
  }, []);

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

  const [error, setError] = useState(null);

  const LOGIN_API = globalVariables.baseUrl + '/authentication/api/login/';
  const REGISTER_API = globalVariables.baseUrl + '/authentication/api/register/'

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('authState');
    setIsAuthenticated(false);
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
        localStorage.setItem('authState', JSON.stringify({ userData }));
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
        setError(null);
        setLoginModalOpen(false)
        setIsAuthenticated(true)
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleRegistration = async (registrationData) => {

    try {
      const response = await axios.post(REGISTER_API, registrationData, {
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
        src={`${globalVariables.staticPath}img_minisasstext1.png`}
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
