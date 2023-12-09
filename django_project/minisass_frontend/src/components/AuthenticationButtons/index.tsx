import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Button, Img } from '../../components';
import LoginFormModal from '../../components/LoginFormModal';
import UserMenu from '../../components/UserMenu';
import UserFormModal from '../../components/RegistrationFormModal';
import EnforcePasswordChange from '../../components/EnforcePasswordChange';
import { logout, OPEN_LOGIN_MODAL, useAuth } from '../../AuthContext';
import { globalVariables } from '../../utils';
import Grid from '@mui/material/Grid'


const UPDATE_PROFILE = globalVariables.baseUrl + '/authentication/api/user/update/'

function AuthenticationButtons() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isEnforcePasswordOpen, setIsEnforcePasswordOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [Registrationloading, setLoading] = useState(false);
  const [registrationInProgress, setRegistrationInProgress] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const [updateProfileInProgress, setUpdateProfileInProgress] = useState(false);

  const { dispatch, state } = useAuth();

  /** Open login modal based on context ***/
  useEffect(() => {
    setLoginModalOpen(state.openLoginModal)
  }, [state.openLoginModal]);

  /** Update context based on login modal open/not. ***/
  useEffect(() => {
    dispatch({ type: OPEN_LOGIN_MODAL, payload: isLoginModalOpen });
  }, [isLoginModalOpen]);

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
    setError(null);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setError(null);
    setUpdateProfileInProgress(false);
    setUpdateProfileLoading(false);
  };

  const [error, setError] = useState(null);

  const LOGIN_API = globalVariables.baseUrl + '/authentication/api/login/';
  const REGISTER_API = globalVariables.baseUrl + '/authentication/api/register/'

  const handleLogout = () => {
    logout(dispatch)
  };

  const handleEnforcePassword = () => {
    setIsEnforcePasswordOpen(false)
    setProfileModalOpen(true);
  }

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
        if (!userData.isPasswordEnforced) {
          setIsEnforcePasswordOpen(true)
        }
        setError(null);
        setLoginModalOpen(false)
      } else {
        if(!response.data.is_authenticated){
          setError('Please complete registration to continue.');
        }
        else setError('Invalid credentials. Please try again.');
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
        setLoading(true)
        // Simulate 2-second delay for registration process
        setTimeout(() => {
          setLoading(false);
          setRegistrationInProgress(true);
        }, 1200);
      } else {
        setError( JSON.stringify(response.data));
      }
    } catch (error) {
      setError(error.message);
    }
  };
   
  const handleUpdateProfile = async (data) => {
    const newData = {
      ...data,
      organisation_name: data.organizationName,
      organisation_type: data.organizationType
    }
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.access_token}`;
      const response = await axios.post(UPDATE_PROFILE, newData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setLoading(true)
        // Simulate 2-second delay for update process
        setTimeout(() => {
          setUpdateProfileLoading(false);
          setUpdateProfileInProgress(true);
        }, 1200);
      } else {
        setError( JSON.stringify(response.data));
      }
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
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
        { state.isAuthenticated ? (
          <Grid container spacing={2} flexDirection={'row-reverse'}>
            <Grid item>
              <UserMenu setUpdateProfileOpen={setProfileModalOpen}/>
            </Grid>
            <Grid item
                  className={"w-[230px]"}
            >
              <Button
              onClick={handleLogout}
              className="sm:bottom-[130px] cursor-pointer font-semibold leading-[normal] left-3.5 sm:left-[105px] relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
              shape="square"
              color="blue_900"
              size="xs"
              variant="fill"
            >
              Logout
            </Button>
            </Grid>
          </Grid>
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
              className="sm:bottom-[130px] cursor-pointer font-semibold leading-[normal] left-3.5 sm:left-[105px] relative rounded-bl-[15px] rounded-br-[15px] text-base text-center w-full"
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
      <UserFormModal
        isOpen={isRegisterModalOpen} 
        onClose={closeRegisterModal} 
        onSubmit={handleRegistration} 
        error_response={error}
        Registrationloading={Registrationloading}
        registrationInProgress={registrationInProgress}
        isRegister={true}
        />
      <UserFormModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        onSubmit={handleUpdateProfile}
        error_response={error}
        Registrationloading={updateProfileLoading}
        registrationInProgress={updateProfileInProgress}
        isRegister={false}
        updatePassword={true}
        />
      <EnforcePasswordChange
        isOpen={isEnforcePasswordOpen}
        onClose={handleEnforcePassword}
      />
    </div>
  );
}

export default AuthenticationButtons;
