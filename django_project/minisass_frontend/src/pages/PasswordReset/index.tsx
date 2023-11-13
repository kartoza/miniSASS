import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../../components";
import Footer from "../../components/Footer";
import { ForgotPasswordForm } from "../../components/ForgotPasswordForm";
import PasswordResetForm from "../../components/PasswordResetForm";
import axios from "axios";

const validateToken = async (email, token) => {
  try {
    const response = await axios.post(
      `${window.location.origin}/authentication/api/validate-token`,
      { email, token }
    );
    return response.data.isValid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

const PasswordResetPage: React.FC = () => {

  // State to control which form to display
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const token = params.get("token");
  const navigate = useNavigate();

  const [isForgotPassword, setIsForgotPassword] = useState(!email && !token);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    if (!isForgotPassword && email && token) {
      validateToken(email, token).then((isValid) => {
        setIsValidToken(isValid);
      });
    }
  }, [isForgotPassword, email, token]);


  return (
    <>
      <div className="bg-white-A700 flex flex-col font-raleway items-center justify-start mx-auto pb-[5px] w-full">
        <div className="h-[282px] md:px-5 relative w-full">
          
          <div className="bg-gray-200 flex flex-col items-start justify-end mt-auto mx-auto p-12 md:px-10 sm:px-5 relative rounded-br-[65px] md:top-[-105px] sm:top-[-80px] top-[0px] md:w-[102%] sm:w-[144%] w-full">
            <div className="flex flex-col items-center justify-start md:ml-[0] ml-[79px] mt-[61px]">
              <Text
                className="sm:text-[32px] md:text-[38px] text-[42px] text-blue-900"
                size="txtRalewayRomanBold42"
              >
                {isForgotPassword ? ( `Forgot Password` ) : ( `Update Password`)}
              </Text>
            </div>
          </div>
        </div>

       
        <div className="flex flex-col gap-9 items-start justify-start w-auto sm:w-full">
          {/* Display the appropriate form based on the state and token validation. */
          isForgotPassword ? (
            <ForgotPasswordForm />
          ) : isValidToken ? (
            <PasswordResetForm email={email} token={token} />
          ) : (
            <div className="bg-red-100 text-red-600 p-4 rounded">Token is invalid. Please request a new reset link.</div>
          )}
        </div>
       
       <br />
        <p style={{ textAlign: 'center' }}>
          <span className="common-pointer" style={{ color: '#539987' }} onClick={() => navigate("/")}>Go Back</span>
        </p>
       
       
        <Footer className="flex items-center justify-center mt-28 md:px-5 sm:w-[144%] w-full" />
      </div>
    </>
  );
};

export default PasswordResetPage;
