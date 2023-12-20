import React, { useState } from "react";
import axios from "axios";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import LinearProgress from '@mui/material/LinearProgress';


export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [textColor, settextColor] = useState('');
  const [Message, setMessage] = useState('Please provide the email you registered with, and you will receive instructions shortly on how to reset your forgotten password.');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);

  const handleSendResetLink = () => {
    // Ensure the email is valid before sending the request
    if (isValidEmail) {
      setIsLoading(true)
      axios
        .post(`${window.location.origin}/authentication/api/request-reset/`, {
          email: email,
        })
        .then((response) => {
          setIsLoading(false)
          setIsResetLinkSent(true)
          if (response.status === 200) {
            setMessage('Email with the reset link has been sent.')
            settextColor('bg-green-100 text-green-600')
          }
        })
        .catch((error) => {
          setIsLoading(false)
          console.error("Error sending reset link:", error);
          setMessage(error.message)
          settextColor('bg-red-100 text-red-600')
        });
    }
  };

  // Regular expression for basic email validation
  const emailRegex = /\S+@\S+\.\S+/;

  const validateEmail = (inputEmail: string) => {
    setIsValidEmail(emailRegex.test(inputEmail));
  };

  return (
    <div className="w-full">
      {isLoading ? ( <div style={{width: '200px'}}><LinearProgress color="success" /> </div>) : (
        <div>
        
        <div className={`${textColor} p-2 rounded mb-4`} style={{marginLeft: '-1.5%'}}>
          <Text
            className="leading-[136.40%] mt-8 text-s w-full"
            size="txtRalewayRomanRegular20"
          >{Message}
         </Text>
        </div>
         
        
        <br />
        {!isResetLinkSent &&
        <><label htmlFor="email">Email: </label><br /><input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setMessage('Please provide the email you registered with, and you will receive instructions shortly on how to reset your forgotten password.');
                settextColor('');
                setEmail(e.target.value);
                validateEmail(e.target.value);
              } }
              style={{ borderRadius: '4px', width: '16.5vw' }} /><br /><br /><Button
                className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
                color="blue_gray_500"
                size="xs"
                variant="fill"
                style={{
                  marginRight: "-40%",
                  opacity: isValidEmail ? 1 : 0.5, // Set opacity based on isValidEmail
                }}
                onClick={handleSendResetLink}
                disabled={!isValidEmail}
              >
                Send reset link
              </Button></>
        }

      </div>
      )}
    </div>
  );
};
