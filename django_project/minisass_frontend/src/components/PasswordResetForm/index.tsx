import React, { useState } from "react";
import axios from "axios";
import { Button } from "../../components/Button";
import { globalVariables } from "../../utils";


const PasswordResetForm = ({ uid = "", token = "" }) => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [resetErrors, setResetErrors] = useState<string[]>([]);
  const [textColor, settextColor] = useState('');

  const PASSWORD_RESET_API = globalVariables.baseUrl + '/authentication/api/update-password-reset/'

  const handleResetPassword = async () => {
    if (newPassword !== repeatPassword) {
      setResetErrors(["New Password and Repeat Password must match."]);
      return;
    }

    try {
      const response = await axios.post(`${PASSWORD_RESET_API}${uid}/${token}/`, {newPassword: newPassword});

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
      // Narrowed through axios rather than read straight off `error`, which
      // TypeScript types as unknown. The previous version raised TS18046 and
      // would also have thrown a second time on a non-axios failure, replacing
      // the real error with "cannot read property response of undefined".
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error
        : undefined;

      if (typeof errorMessage === "string" && errorMessage.includes("Multiple users found")) {
        // Tell the user to contact an administrator; they cannot fix this one.
        setResetErrors(["Multiple users found for this email address. Please contact the system administrator."]);
      } else if (typeof errorMessage === "string" && errorMessage) {
        setResetErrors([errorMessage]);
      } else {
        setResetErrors(["Password update failed. Please try again later."]);
      }
      settextColor('bg-red-100 text-red-600');
    }
  };

  // Determine whether the button should be disabled
  const isDisabled = newPassword !== repeatPassword;

  return (
    <div className="w-full max-w-[560px]">
      {resetErrors.length > 0 && (
        <div className={`${textColor} p-3 rounded mb-4`}>
          {resetErrors.join(", ")}
        </div>
      )}
      {/*
        A plain two-column grid that collapses on narrow screens. This was a
        row-reverse flexbox, which rendered the fields in the opposite order to
        the markup - so the box labelled "Password" appeared on the right of the
        one labelled "Confirm Password". The inputs were also 16.5vw wide, which
        is about 60px on a phone.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="new-password">Password:</label>
          <input
            id="new-password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) =>  {
              setNewPassword(e.target.value);
              setResetErrors([]);
            }}
            placeholder="Password"
            className="border border-gray-400 p-2 rounded w-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            id="confirm-password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={repeatPassword}
            onChange={(e) => {
              setRepeatPassword(e.target.value)
              setResetErrors([]);
            }}
            placeholder="Confirm Password"
            className="border border-gray-400 p-2 rounded w-full"
          />
        </div>
      </div>
      {newPassword && repeatPassword && newPassword !== repeatPassword && (
        <p className="mt-2 text-red-600">Passwords do not match</p>
      )}
      <div className="flex items-center justify-between mt-6">
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
