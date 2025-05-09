import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import PrivacyConsentModal from "./components/PrivacyConsentModal"
import { usePrivacyConsent, CLOSE_PRIVACY_MODAL } from './PrivacyConsentContext';

function App() {
  const { state, dispatch } = usePrivacyConsent();
  const closePrivacyModal = () => {
    setConsentModalOpen(false);
  };
  useEffect(() => {
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const duration = (Date.now() - startTime) / 1000;
      ReactGA.event("session_duration", {
        session_length_seconds: duration,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <PrivacyConsentModal
        open={state.isPrivacyModalOpen}
        onClose={() => dispatch({ type: CLOSE_PRIVACY_MODAL })}
      />
      <Routes />
    </>
  );
}

export default App;
