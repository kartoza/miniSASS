import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import PrivacyConsentModal from "./components/PrivacyConsentModal"

function App() {
  const [consentModalOpen, setConsentModalOpen] = useState(false);
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
        open={consentModalOpen}
        setOpen={setConsentModalOpen}
        onClose={closePrivacyModal}/>
      <Routes />
    </>
  );
}

export default App;
