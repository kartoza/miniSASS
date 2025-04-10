import React, {useState} from "react";
import Routes from "./Routes";
import PrivacyConsentModal from "./components/PrivacyConsentModal"

function App() {
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  return (
    <>
      <PrivacyConsentModal open={consentModalOpen} setOpen={setConsentModalOpen} />
      <Routes />
    </>
  );
}

export default App;
