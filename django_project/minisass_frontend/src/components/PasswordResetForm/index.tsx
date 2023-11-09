import React, { useState } from "react";
import axios from "axios";
import { Button } from "../../components/Button";

const PasswordResetForm = ({ email = "", token = "" }) => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [resetErrors, setResetErrors] = useState<string[]>([]);
  const [textColor, settextColor] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== repeatPassword) {
      setResetErrors(["New Password and Repeat Password must match."]);
      return;
    }

    try {
      const response = await axios.post(
        `${window.location.origin}/authentication/api/update-password`,
        { newPassword, email, token }
      );

      if (response.status === 200) {
        // Password reset was successful
        setResetErrors([]);
        setResetErrors(["Password update successful."]);
        settextColor('bg-green-100 text-green-600')

      }else {
        setResetErrors(["Password update failed. Please try again later."]);
        settextColor('bg-red-100 text-red-600')
      }
    } catch (error) {
      // Handle API request errors, e.g., network issues or server errors
      console.error(error);
      setResetErrors(["Password update failed. Please try again later."]);
      settextColor('bg-red-100 text-red-600')
    }
  };

  // Determine whether the button should be disabled
  const isDisabled = newPassword !== repeatPassword;

  return (
    <div className=" ">
      {resetErrors.length > 0 && (
        <div className={`${textColor} p-2 rounded mb-4`}>
          {resetErrors.join(", ")}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "row-reverse", gap: "40px" }}>
        <div style={{ flex: 1, flexDirection: "column" }}>
          <label>Confirm Password:</label>
          <br />
          <input
            type="password"
            name="password"
            value={newPassword}
            onChange={(e) =>  {
              setNewPassword(e.target.value);
              setResetErrors([]);
            }}
            placeholder="Password"
            style={{ borderRadius: "4px", width: "16.5vw" }}
          />
           <br/>
          {newPassword && newPassword !== repeatPassword && (
            <span style={{ color: "red" }}>Passwords do not match</span>
          )}
        </div>
        <div style={{ flex: 1, flexDirection: "column" }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="confirmPassword"
            value={repeatPassword}
            onChange={(e) => {
              setRepeatPassword(e.target.value)
              setResetErrors([]);
            }}
            placeholder="Confirm Password"
            style={{ borderRadius: "4px", width: "16.5vw" }}
          />
        </div>
      </div>
      <br />
      <div className="flex items-center justify-between">
        <Button
          className="cursor-pointer rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] text-center text-lg tracking-[0.81px] w-[156px]"
          color="blue_gray_500"
          size="xs"
          variant="fill"
          style={{
            opacity: isDisabled ? 0.5 : 1,
          }}
          onClick={handleResetPassword}
          disabled={isDisabled}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PasswordResetForm;
