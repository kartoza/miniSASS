import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Link,
} from "@mui/material";
import { globalVariables } from "../../utils";
import {useAuth} from "../../AuthContext";

const PRIVACY_CONSENT_API = globalVariables.baseUrl + "/privacy-policy/consent/";

export interface PrivacyConsentModalProps {
  open: boolean;
  onClose: () => void;
  setOpen: (open: boolean) => void;
}


export default function PrivacyConsentModal(props: PrivacyConsentModalProps) {
  const {dispatch, state} = useAuth();


  const sendConsent = async (agree: boolean) => {
    try {
      let formData = new FormData();
      formData.append('agree', JSON.stringify(agree));
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.access_token}`;
      const response = await axios.post(PRIVACY_CONSENT_API, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201) {
        props.onClose();
      }
    } catch (error) {
      console.error("Error sending consent:", error);
    }
  };

  const handleAccept = async () => {
    localStorage.setItem("hasPrivacyConsent", "true");
    await sendConsent(true);
  };

  const handleDecline = async () => {
    localStorage.setItem("hasPrivacyConsent", "false");
    await sendConsent(false);
    // Optionally block access or show a message here
  };


  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
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
