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
    if (isValidEmail && email) {
      setIsLoading(true)
      axios
        .post(`${window.location.origin}/authentication/api/request-reset/`, {
          email: email.trim(),
        })
        .then((response) => {
          setIsLoading(false)
          if (response.status === 200) {
            setIsResetLinkSent(true)
            setMessage('Email with the reset link has been sent.')
            settextColor('bg-green-100 text-green-600')
          }
        })
        .catch((error) => {
          setIsLoading(false)
          console.error("Error sending reset link:", error);
          // The API explains what went wrong - "User not found", or that the
          // mail service is unavailable. Showing error.message instead put raw
          // Axios text such as "Request failed with status code 500" in front of
          // the user, which tells them nothing they can act on.
          const data = error.response?.data;
          setMessage(
            data?.error ||
            data?.message ||
            'Something went wrong while sending the reset link. Please try again shortly.'
          )
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
    // Capped at 420px rather than using a viewport-relative width: the input
    // used to be 16.5vw, which rendered as a ~60px box on a phone and drifted
    // ever wider on a large monitor. Horizontal placement comes from the page's
    // container, so nothing here needs padding or margins of its own.
    <div className="w-full max-w-[420px]">
      {isLoading ? (
        <div className="w-full"><LinearProgress color="success" /></div>
      ) : (
        <div className="w-full">

          {/* The negative margin that used to pull this box out of alignment
              with the field below it has been removed. */}
          <div className={`${textColor} p-3 rounded mb-4`}>
            <Text
              className="leading-[136.40%] text-s"
              size="txtRalewayRomanRegular20"
            >
              {Message}
            </Text>
          </div>

          {!isResetLinkSent && (
            // A real form, so pressing Enter submits. Previously the button was
            // the only way to send, which is a trap for anyone using a keyboard
            // or a mobile "go" key.
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendResetLink();
              }}
            >
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setMessage('Please provide the email you registered with, and you will receive instructions shortly on how to reset your forgotten password.');
                    settextColor('');
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  className="border border-gray-400 p-2 rounded w-full"
                />
              </div>
              <Button
                className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
                color="blue_gray_500"
                size="xs"
                variant="fill"
                type="submit"
                style={{
                  // The -40% right margin that pushed this button outside its
                  // container is gone; only the disabled cue remains.
                  opacity: isValidEmail && email ? 1 : 0.5,
                }}
                disabled={!isValidEmail || !email}
              >
                Send reset link
              </Button>
            </form>
          )}

        </div>
      )}
    </div>
  );
};
