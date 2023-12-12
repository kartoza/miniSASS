import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Modal from 'react-modal';
import { Button , Img} from "../../components";
import Select from "react-select";
import CountrySelector from "../../components/Countries/selector";
import { COUNTRIES } from "../../components/Countries/countries";
import { SelectMenuOption } from "../../components/Countries/types";
import { globalVariables } from '../../utils';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import axios from "axios";
import {useAuth} from "../../AuthContext";
import Checkbox from '@mui/material/Checkbox';


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface RegistrationFormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  organizationType: string;
  organizationName: string;
  country: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
  updatePassword: boolean;
}

const UPDATE_PROFILE = globalVariables.baseUrl + '/authentication/api/user/update'

const EnforePasswordChangeModal: React.FC<Props> = ({
  isOpen,
  onClose
 }) => {


  const { dispatch, state  } = useAuth();

  return (
    <>
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '43vw',
          background: 'white',
          border: 'none',
          borderRadius: '0px 25px 25px 25px',
        },
      }}
    >
        <div>
          <h3
              style={{
                fontFamily: 'Raleway',
                fontStyle: 'normal',
                fontWeight: 700,
                alignItems: 'flex-start',
                fontSize: '24px',
                lineHeight: '136.4%',
                color: '#539987',
              }}
            >
              Password needs update
            </h3>
            <br />
          <Typography>
            Please use a stronger password for your account
          </Typography>

          <Button
              className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
              color="blue_gray_500"
              size="xs"
              variant="fill"
              style={{ marginLeft: "65%" }}
              onClick={onClose}
            >
              Ok
            </Button>
        </div>
    </Modal>
  </>
  );
};

export default EnforePasswordChangeModal;
