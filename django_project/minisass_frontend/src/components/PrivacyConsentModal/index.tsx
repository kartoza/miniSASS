import { useEffect } from "react";
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

const PRIVACY_CONSENT_API = globalVariables.baseUrl + "/privacy-policy/consent/";

export interface PrivacyConsentModalProps {
  open?: boolean;
  forceShow?: boolean;
  onClose?: () => void;
  setOpen?: (open: boolean) => void;
}

export default function PrivacyConsentModal({
  open,
  forceShow,
  onClose,
  setOpen,
}: PrivacyConsentModalProps) {
  const { state } = useAuth();
  const hasConsent = localStorage.getItem("hasPrivacyConsent");

  useEffect(() => {
    if (!hasConsent && !forceShow && setOpen) {
      setOpen(true);
    }
  }, [hasConsent, forceShow, setOpen]);

  const sendConsent = async (agree: boolean) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.user.access_token}`;
      const response = await axios.post(
        PRIVACY_CONSENT_API,
        { agree },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201 && onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error sending consent:", error);
    }
  };

  const handleAccept = async () => {
    localStorage.setItem("hasPrivacyConsent", "true");
    await sendConsent(true);
    if (setOpen) setOpen(false);
  };

  const handleDecline = async () => {
    localStorage.setItem("hasPrivacyConsent", "false");
    await sendConsent(false);
    if (setOpen) setOpen(false);
  };

  return (
    <Dialog open={!!open} maxWidth="sm" fullWidth className='privacy-modal'>
      <DialogTitle>Privacy Policy Consent</DialogTitle>
      <DialogContent>
        <Typography>
          We use cookies and analytics to improve your experience. By clicking{" "}
          <strong>Accept</strong>, you agree to our{" "}
          <Link href="/#/privacy-policy" target="_blank" rel="noopener">
            Privacy Policy
          </Link>
          .
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleAccept} color="primary">
          Accept
        </Button>
        <Button variant="outlined" onClick={handleDecline} color="secondary">
          Decline
        </Button>
      </DialogActions>
    </Dialog>
  );
}
