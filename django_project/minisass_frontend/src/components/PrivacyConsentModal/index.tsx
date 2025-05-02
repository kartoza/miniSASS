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
    if (!hasConsent && !forceShow && setOpen && !window.location.href.includes('privacy-policy')) {
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

  return (
    <Dialog open={!!open} maxWidth="sm" fullWidth className='privacy-modal'>
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
          fullWidth
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
