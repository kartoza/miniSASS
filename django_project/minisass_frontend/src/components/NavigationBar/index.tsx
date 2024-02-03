import * as React from 'react';
import { Button, Img, Text } from "../../components";
import AuthenticationButtons from '../../components/AuthenticationButtons';
import { useNavigate } from "react-router-dom";
import ContactFormModal from '../../components/ContactFormModal';
import { useState } from 'react';
import { ContactFormData } from '../../components/ContactFormModal/types';
import ConfirmationDialogRaw from "../../components/ConfirmationDialog";

interface NavigationProps {
    path: string;
}

function NavigationBar(props) {
  const { activePage } = props;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = React.useState(false);
  const [navigateLocation, setNavigation] = useState('/');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (formData: ContactFormData) => {
    closeModal();
  };

  const handleDialogCancel = () => {
    setIsCloseDialogOpen(false)
  };

  const handleCloseConfirm = () => {
    setIsCloseDialogOpen(false);
    navigateTo({ path: navigateLocation })
  };

  const navigateTo = ({ path }: NavigationProps): void => {
    navigate(path);
  };


  return (
    <>
      <ConfirmationDialogRaw
        id="logout-dialog"
        keepMounted
        value="logout"
        open={isCloseDialogOpen}
        onClose={handleDialogCancel}
        onConfirm={handleCloseConfirm}
        title="Confirm Navigation"
        message="The data input form is open ,are you sure you want to navigate away from this page, this will cause any unsaved data to be lost?"
      />
      
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
            onClick={() => { 
              if (props.isDisableNavigations) {
                setIsCloseDialogOpen(true);
                setNavigation('/')
              }
            }}
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
            onClick={() => { 
              if (props.isDisableNavigations) {
                setIsCloseDialogOpen(true);
                setNavigation('/howto')
              }
            }}
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
            onClick={() => { 
              if (props.isDisableNavigations) {
                setIsCloseDialogOpen(true);
                setNavigation('/map')
              }
            }}
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
          className="cursor-pointer font-semibold leading-[normal] relative rounded-bl-[15px] rounded-tl-[15px]
          text-base text-center w-full"
          shape="square"
          color="blue_900"
          size="xs"
          variant="fill"
          onClick={() => {
            if (props.isDisableNavigations) {
              setIsCloseDialogOpen(true);
              setNavigation('/mobile-app')
            }
          }}
        >
          Download miniSASS App
        </Button>
      </div>

                      
      </div>
    </>
  );
}

export default NavigationBar;
