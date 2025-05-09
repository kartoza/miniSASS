import { useEffect, useRef, useCallback, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Link,
} from "@mui/material";
import axios from "axios";
import { globalVariables } from "../../utils";
import { useAuth } from "../../AuthContext";
import { usePrivacyConsent, CLOSE_PRIVACY_MODAL, OPEN_PRIVACY_MODAL } from '../../PrivacyConsentContext';

const PRIVACY_CONSENT_API = globalVariables.baseUrl + "/privacy-policy/consent/";
const PRIVACY_CONSENT_CHECK = globalVariables.baseUrl + "/privacy-policy/check/";

export interface PrivacyConsentModalProps {
  open?: boolean;
  forceShow?: boolean;
  onClose?: () => void;
}

export default function PrivacyConsentModal({
  open,
  forceShow,
  onClose,
}: PrivacyConsentModalProps) {
  const { dispatch } = usePrivacyConsent();
  const { state } = useAuth();
  const [acceptedPrivacyPolicyVersion, setAcceptedPrivacyPolicyVersion] = useState("");
  let hasConsent = acceptedPrivacyPolicyVersion === PRIVACY_POLICY_VERSION;
  hasConsent = state.user? hasConsent : true;

    // Create a ref to track if the analytics endpoint has been called
  const analyticsEndpointCalled = useRef(false);

  // Debounced function to call the analytics endpoint
  const debouncedAnalyticsCall = useCallback(() => {
    if (!analyticsEndpointCalled.current && state.user && state.user.access_token) {
      analyticsEndpointCalled.current = true;

      // Call the analytics endpoint
      const getAcceptedPrivacyPolicycallAnalyticsEndpoint = async () => {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${state.user.access_token}`;
          const response = await axios.get(
            PRIVACY_CONSENT_CHECK
          );
          setAcceptedPrivacyPolicyVersion(response.data.policy.version);
        } catch (error) {
          console.error("Error sending analytics:", error);
        }
      };

      getAcceptedPrivacyPolicycallAnalyticsEndpoint();
    }
  }, [state.user]);

  useEffect(() => {
    if (open && state.user && state.user.access_token) {
      // Call the debounced analytics function when the modal is opened
      debouncedAnalyticsCall();
    }
  }, [open, debouncedAnalyticsCall, state.user]);


  useEffect(() => {
    if (!hasConsent && !forceShow && !window.location.href.includes('privacy-policy')) {
      dispatch({ type: OPEN_PRIVACY_MODAL });
    }
  }, [hasConsent, forceShow]);

  const sendConsent = async (agree: boolean) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.user.access_token}`;
      const response = await axios.post(
        PRIVACY_CONSENT_API,
        { agree },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201 && onClose) {
        // localStorage.setItem("acceptedPrivacyPolicyVersion", PRIVACY_POLICY_VERSION);
        onClose();
      }
    } catch (error) {
      console.error("Error sending consent:", error);
    }
  };

  const handleAccept = async () => {
    await sendConsent(true);
    dispatch({ type: CLOSE_PRIVACY_MODAL });
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth className='privacy-modal'>
      <DialogTitle>We've updated our Privacy Policy</DialogTitle>
      <DialogContent>
        <Typography>
          We encourage you to review our updated {" "}
          <Link href="/#/privacy-policy" target="_blank" rel="noopener">
            Privacy Policy
          </Link>.
          By continuing, you agree to the updated terms listed there.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, display: 'block' }}>
        <Button
          variant="contained"
          onClick={handleAccept}
          color="primary"
          sx={{ backgroundColor: '#0e4981' }}
          fullWidth
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
